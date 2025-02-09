import { PersonalAccessToken, User } from "@prisma/client"

export type UserResponse = {
    username: string,
    name: string,
    token?: string,
    personal_token?: object
}

export type CreateUserRequest = {
    username : string,
    name : string,
    password : string
}

export type UpdateUserRequest = {
    name? : string,
    password? : string
}

export type LoginUserRequest = {
    username : string,
    password : string,
}

export function toUserResponse(user : User, token?: PersonalAccessToken): UserResponse {
    return {
        name : user.name,
        username : user.username,
        personal_token: token
    }
}