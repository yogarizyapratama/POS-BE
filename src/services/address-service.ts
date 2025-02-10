import { Address, User } from "@prisma/client";
import { AddressResponse, CreateAddressRequest, GetAddressRequest, RemoveAddressRequest, UpdateAddressRequest, toAddressResponse } from "../model/address-model";
import { Validation } from "../validation/validation";
import { AddressValidation } from "../validation/address-validation";
import { ContactService } from "./contact-service";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";

export class AddressService{
    static async create(user: User, request: CreateAddressRequest): Promise<AddressResponse>{
        const createRequest = Validation.validate(AddressValidation.CREATE, request);

        await ContactService.checkContactMustExist(user.username, createRequest.contactId);

        const address = await prismaClient.address.create({
            data: createRequest
        })

        return toAddressResponse(address);
    }

    static async get(user: User, request: GetAddressRequest): Promise<AddressResponse>{
        const getRequest = Validation.validate(AddressValidation.GET, request);

        await ContactService.checkContactMustExist(user.username, getRequest.contactId);

        const address = await this.checkAddressMustExist(getRequest.contactId, getRequest.id);

        return toAddressResponse(address);
    }

    static async checkAddressMustExist(contactId: string, addressId: string):Promise<Address>{
        const address = await this.checkAddressMustExist(contactId, addressId);

        return address
    }

    static async update(user: User, request: UpdateAddressRequest): Promise<AddressResponse>{
        const updateRequest = Validation.validate(AddressValidation.UPDATE, request);

        await ContactService.checkContactMustExist(user.username, request.contactId);
        await this.checkAddressMustExist(updateRequest.contactId, updateRequest.id)

        const address = await prismaClient.address.update({
            where:{
                id: updateRequest.id,
                contactId: updateRequest.contactId
            },
            data: updateRequest
        })

        return toAddressResponse(address);
    }
    
    static async remove(user: User, request: RemoveAddressRequest): Promise<AddressResponse>{
        const removeRequest = Validation.validate(AddressValidation.REMOVE, request);
        await ContactService.checkContactMustExist(user.username, removeRequest.contactId);
        await this.checkAddressMustExist(removeRequest.contactId, removeRequest.id);

        const address = await prismaClient.address.delete({
            where:{
                id: removeRequest.id
            }
        })

        return toAddressResponse(address);
    }

    static async list(user: User, contactId:string): Promise<Array<AddressResponse>>{
        await ContactService.checkContactMustExist(user.username, contactId);

        const addresses = await prismaClient.address.findMany({
            where:{
                contactId: contactId
            }
        })

        return addresses.map(address => toAddressResponse(address));
    }
}