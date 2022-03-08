import { hash } from "bcryptjs"
import validator from "validator"
import JWT from "jsonwebtoken"
import "dotenv/config"

import { User } from "@prisma/client"

import { Context } from "../.."

export interface SignUpArgs {
    input: {
        email: string
        name: string
        bio: string
        password: string
    }
}

export interface UserPayload {
    userErrors: { message: String }[],
    token: string | null

}

export const authMutations = {
    signup: async (
        _parent: any,
        { input } : SignUpArgs,
        { prisma }: Context
    ): Promise<UserPayload> => {
        const errors: string[] = []
        let token = null

        console.log(input)
        const { bio, email, name, password } = input
        if (!validator.isEmail(email)) errors.push("Invalid email")
        if (!validator.isLength(password, { min: 5 })) errors.push("Invalid password")
        const hashedPassword = await hash(password, 10)

        if (errors.length === 0) {
            try {
                const user = await prisma.user.create({
                    data: {
                        email,
                        name,
                        password: hashedPassword
                    }
                })
                prisma.profile.create({
                    data: {
                        bio,
                        userId: user.id
                    }
                })
                token = JWT.sign(
                    {
                        userId: user.id
                    }, 
                    process.env.JWT_KEY as JWT.Secret, 
                    {
                        expiresIn: 3600
                    }
                )
            } catch (error) {
                console.error(error)
                errors.push("Prisma error creating User")
            }
        }

        return {
            token,
            userErrors: errors.map(error => {
                return {
                    message: error
                }
            })
        }
    }
}
