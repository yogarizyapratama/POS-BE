import { Contact } from "@prisma/client";

export type ContactResponse = {
    id:string;
    firstname:string;
    lastname?:string | null;
    email?: string | null;
    phone?: string | null;
}

export type CreateContactRequest = {
    firstname:string;
    lastname?:string;
    email?: string;
    phone?: string;
}

export type UpdateContactRequest = {
    id: string;
    firstname:string;
    lastname?:string;
    email?: string;
    phone?: string;
}

export type SearchContactRequest = {
    name?: string;
    email?: string;
    phone?: string;
    page: number;
    size: number;
}

export function toContactResponse(contact: Contact) : ContactResponse {
    return{
        id: contact.id,
        firstname: contact.firstname,
        lastname: contact.lastname,
        email: contact.email,
        phone: contact.phone
    }
}