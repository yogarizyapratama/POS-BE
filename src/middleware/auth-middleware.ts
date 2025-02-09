import { NextFunction, Request, Response } from "express";
import { prismaClient } from "../application/database";
import { UserRequest } from "../type/user-request";
import { logger } from "../application/logging";

export const authMiddleware = async (req: UserRequest, res: Response, next: NextFunction) => {
    const token = req.get('X-API-TOKEN');

    if(token){
        const user = await prismaClient.user.findFirst({
            where:{
                token : token
            },
            include: {
                personal_access_tokens: true,
            },
        })

        if (user?.personal_access_tokens) {
            if (new Date() >= user.personal_access_tokens.expiresAt) {
                res.status(401).json({
                    errors: 'Unauthorized',
                }).end();

                return;
            }

            if(user.personal_access_tokens.revoked) {
                res.status(401).json({
                    errors: 'Unauthorized',
                }).end();

                return;
            }
        }
        logger.info('logout2')
        if(user){
            req.user = user;
            next()
            return;
        }
    }

    res.status(401).json({
        errors : 'Unauthorized'
    }).end()
}