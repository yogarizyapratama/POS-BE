import { ZodType, z } from "zod";

export class AddressValidation{
    static readonly CREATE: ZodType = z.object({
        contactId: z.string(),
        street: z.string().min(1).max(255).optional(),
        city: z.string().min(1).max(100).optional(),
        province: z.string().min(1).max(100).optional(),
        country: z.string().min(1).max(100),
        postal_code: z.string().min(1).max(10)
    });

    static readonly UPDATE: ZodType = z.object({
        id: z.string(),
        contactId: z.string(),
        street: z.string().min(1).max(255).optional(),
        city: z.string().min(1).max(100).optional(),
        province: z.string().min(1).max(100).optional(),
        country: z.string().min(1).max(100),
        postal_code: z.string().min(1).max(10)
    });


    static readonly GET: ZodType = z.object({
        contactId: z.string(),
        id: z.string()
    });

    static readonly REMOVE = this.GET;
}