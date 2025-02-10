import { z, ZodType } from "zod";

export class ContactValidation{
    static readonly CREATE: ZodType = z.object({
        firstname: z.string().min(1).max(100),
        lastname: z.string().min(1).max(100).optional(),
        email: z.string().min(1).max(100),
        phone: z.string().min(1).max(20).optional(),
    })

    static readonly UPDATE: ZodType = z.object({
        id: z.string(),
        firstname: z.string().min(1).max(100),
        lastname: z.string().min(1).max(100).optional(),
        email: z.string().min(1).max(100),
        phone: z.string().min(1).max(20).optional(),
    })

    static readonly SEARCH: ZodType = z.object({
        name: z.string().min(1).max(100).optional(),
        email: z.string().min(1).max(100).optional(),
        phone: z.string().min(1).max(100).optional(),
        page: z.number().positive(),
        size: z.number().positive(),
    })
}