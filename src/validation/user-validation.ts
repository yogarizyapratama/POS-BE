import { ZodType, z } from "zod";

export class UserValidation{
    static readonly REGISTER : ZodType = z.object({
        username : z.string().min(1).max(100),
        password : z.string().min(1).max(100),
        name : z.string().min(1).max(100)
    })

    static readonly LOGIN : ZodType = z.object({
        username : z.string().min(1).max(100),
        password : z.string().min(1).max(100)
    })

    static readonly UPDATE : ZodType = z.object({
        password : z.string().min(1).max(100).optional(),
        name : z.string().min(1).max(100).optional()
    })

    static readonly SEARCH : ZodType = z.object({
        name : z.string().min(1).optional(),
        email : z.string().min(1).optional(),
        phone : z.string().min(1).optional(),
        page: z.number().min(1).positive(),
        size: z.number().min(1).max(100).positive()
    })
}