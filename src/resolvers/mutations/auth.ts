import { compare, hash } from "bcryptjs"
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

export interface SignInArgs {
    input: {
        email: string
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
                token = JWT.sign({ userId: user.id }, process.env.JWT_KEY as JWT.Secret)
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
    },
    signin: async (_parent: any, { input }: SignInArgs, { prisma }: Context): Promise<UserPayload> => {
        const { email, password } = input
        let errors: string[] = []
        let token = null

        const hashedPassword = await hash(password, 10)

        try {
            const user = await prisma.user.findUnique({
                where: {
                    email
                }
            })
            if (user && await compare(password, user.password)) {
                token = JWT.sign({ userId: user.id }, process.env.JWT_KEY as JWT.Secret)
            } else {
                errors.push("Invalid username and/or password")
            }
        } catch(error) {
            errors.push("Prisma error finding User")
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
