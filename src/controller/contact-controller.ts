import { NextFunction, Response } from "express";
import { UserRequest } from "../type/user-request";
import { CreateContactRequest, SearchContactRequest, UpdateContactRequest } from "../model/contact-model.";
import { ContactService } from "../services/contact-service";

export class ContactController{
    static async create(req: UserRequest, res: Response, next: NextFunction){
        try {
            const request: CreateContactRequest = req.body as CreateContactRequest;

            const response = await ContactService.create(req.user!, request);

            res.status(201).json({
                data: response
            })
        } catch (error) {
            next(error);
        }
    }

    static async get(req: UserRequest, res: Response, next: NextFunction){
        try {
            const contactId = req.params.id
            const respose = await ContactService.get(req.user!, contactId);

            res.status(201).json({
                data: respose
            })
        } catch (error) {
            next(error);
        }
    }

    static async update(req: UserRequest, res: Response, next: NextFunction){
        try {
            const request: UpdateContactRequest = req.body as UpdateContactRequest;
            request.id = req.params.contactId;

            const response = await ContactService.update(req.user!, request);

            res.status(201).json({
                data: response
            })
        } catch (error) {
            next(error);
        }
    }

    static async remove(req: UserRequest, res: Response, next: NextFunction){
        try {
            const contactId = req.params.contactId;

            await ContactService.remove(req.user!, contactId);

            res.status(201).json({
                data: 'OK'
            })
        } catch (error) {
            next(error);
        }
    }


    static async search(req: UserRequest, res: Response, next: NextFunction){
        try {
            const request: SearchContactRequest = {
                name: req.query.name as string,
                email: req.query.email as string,
                phone: req.query.phone as string,
                page: req.query.page ? Number(req.query.page) : 1,
                size: req.query.size ? Number(req.query.size) : 1,
            }
        
            const response = await ContactService.search(req.user!, request);

            res.status(201).json(response)
        } catch (error) {
            next(error);
        }
    }
}