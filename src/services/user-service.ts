import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { CreateUserRequest, LoginUserRequest, UpdateUserRequest, UserResponse, toUserResponse } from "../model/user-model";
import { UserValidation } from "../validation/user-validation";
import { Validation } from "../validation/validation";
import {v4 as uuid} from 'uuid';
import bcrypt from 'bcrypt';
import { User } from "@prisma/client";

export class UserService {
    static async register(request: CreateUserRequest): Promise<UserResponse> {
        const registerRequest = Validation.validate(UserValidation.REGISTER, request);

        const totalUserWithSameUsername = await prismaClient.user.count({
            where:{
                username: registerRequest.username
            }
        })

        if(totalUserWithSameUsername != 0){
            throw new ResponseError(400, 'username already exist');
        }

        registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

        const user = await prismaClient.user.create({
            data: registerRequest
        })

        return toUserResponse(user);
    }

    static async login(request: LoginUserRequest): Promise<UserResponse> {
        const loginRequest = Validation.validate(UserValidation.LOGIN, request);

        let user = await prismaClient.user.findUnique({
            where:{
                username: loginRequest.username
            }
        });

        if(!user){
            throw new ResponseError(401, 'username or password is wrong');
        }

        const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);

        if(!isPasswordValid){
            throw new ResponseError(401, 'username or password is wrong');
        }

        const token = uuid();

        user = await prismaClient.user.update({
            where:{
                username: loginRequest.username
            },
            data:{
                token : token
            }
        })

        // assign personal access token and expired at 1 day
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const personalToken = await prismaClient.personalAccessToken.upsert({
            where:{
                username : user.username,
            },
            update:{
                token,
                expiresAt
            },
            create:{
                id: uuid(),
                token,
                username : user.username,
                expiresAt
            }
        });

        const response = toUserResponse(user, personalToken);

        return response;
    }

    static async get(user: User): Promise<UserResponse> {
        const personalToken = await prismaClient.personalAccessToken.findFirst({
            where:{
                username : user.username
            },
        })
        
        return toUserResponse(user, personalToken!);
    }

    static async update(user: User, request: UpdateUserRequest) : Promise<UserResponse>{
        const updateRequest = Validation.validate(UserValidation.UPDATE, request);

        if(updateRequest.name){
            user.name = updateRequest.name;
        }

        if(updateRequest.password){
            user.password = await bcrypt.hash(updateRequest.password, 10);
        }

        const result = await prismaClient.user.update({
            where:{
                username: user.username
            },
            data : user
        })

        return toUserResponse(result);
    }
    
    static async logout(user: User) : Promise<UserResponse>{
        const result = await prismaClient.user.update({
            where:{
                username: user.username
            },
            data:{
                token : null
            }
        })

        await prismaClient.personalAccessToken.delete({
            where:{
                username: user.username
            }
        })

        return toUserResponse(result);
    }
}