import { Address } from "@prisma/client"

export type AddressResponse = {
    id: string,
    street?: string | null, 
    city?: string | null, 
    province?: string | null, 
    country: string, 
    postal_code: string, 
}

export type CreateAddressRequest = {
    contactId: string,
    street?: string, 
    city?: string, 
    province?: string, 
    country: string, 
    postal_code: string, 
}

export type UpdateAddressRequest = {
    id: string,
    contactId: string,
    street?: string, 
    city?: string, 
    province?: string, 
    country: string, 
    postal_code: string, 
}

export type GetAddressRequest = {
    contactId: string,
    id: string
}

export type RemoveAddressRequest = GetAddressRequest

export function toAddressResponse(address: Address){
    return {
        id: address.id,
        street: address.street,
        city: address.city,
        province: address.province,
        country: address.country,
        postal_code: address.postal_code
    }
}