import { Contact, User } from "@prisma/client";
import { ContactResponse, CreateContactRequest, SearchContactRequest, UpdateContactRequest, toContactResponse } from "../model/contact-model.";
import { ContactValidation } from "../validation/contact-validation";
import { Validation } from "../validation/validation";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { Pageable } from "../model/page";

export class ContactService{
    static async create(user: User, request: CreateContactRequest): Promise<ContactResponse>{
        const createRequest = Validation.validate(ContactValidation.CREATE, request);

        const record = {
            ...createRequest,
            ...{
                username: user.username,
                createdUsername: user.username
            }
        }
        const contact = await prismaClient.contact.create({
            data: record
        })

        return toContactResponse(contact);
    }

    static async checkContactMustExist(username: string, contactId: string):Promise<Contact>{
        const contact = await prismaClient.contact.findFirst({
            where:{
                id: contactId,
                username: username
            }
        })

        if(!contact){
            throw new ResponseError(404, "Contact Not Found");
        }

        return contact
    }

    static async get(user : User, id: string): Promise<ContactResponse>{
        const contact = await this.checkContactMustExist(user.username, id);

        return toContactResponse(contact);
    }

    static async update(user: User, request: UpdateContactRequest): Promise<ContactResponse>{
        const updateRequest = Validation.validate(ContactValidation.UPDATE, request);

        await this.checkContactMustExist(user.username, request.id);

        const contact = await prismaClient.contact.update({
            where:{
                id: updateRequest.id,
                username: user.username
            },
            data: updateRequest
        })

        return toContactResponse(contact);
    }

    static async remove(user: User, id: string): Promise<ContactResponse>{
        await this.checkContactMustExist(user.username, id);

        const contact = await prismaClient.contact.delete({
            where:{
                id: id,
                username: user.username
            }
        })

        return toContactResponse(contact);
    }

    static async search(user: User, request: SearchContactRequest): Promise<Pageable<ContactResponse>> {
        const searchRequest = Validation.validate(ContactValidation.SEARCH, request);
    
        const skip = (searchRequest.page - 1) * searchRequest.size;
        const filters: any[] = [];
    
        if (searchRequest.name) {
            filters.push({
                OR: [
                    {
                        firstname: {
                            contains: searchRequest.name,
                            mode: "insensitive"
                        }
                    },
                    {
                        lastname: {
                            contains: searchRequest.name,
                            mode: "insensitive"
                        }
                    }
                ]
            });
        }
    
        if (searchRequest.email) {
            filters.push({
                email: {
                    contains: searchRequest.email,
                    mode: "insensitive"
                }
            });
        }
    
        if (searchRequest.phone) {
            filters.push({
                phone: {
                    contains: searchRequest.phone
                }
            });
        }
    
        const whereCondition = {
            username: user.username,
            AND: filters.length > 0 ? filters : undefined
        };
    
        const contacts = await prismaClient.contact.findMany({
            where: whereCondition,
            take: searchRequest.size,
            skip: skip
        });
    
        const total = await prismaClient.contact.count({
            where: whereCondition
        });
    
        return {
            data: contacts.map(contact => toContactResponse(contact)),
            paging: {
                current_page: searchRequest.page,
                total_page: Math.ceil(total / searchRequest.size),
                size: searchRequest.size
            }
        };
    }
    
}