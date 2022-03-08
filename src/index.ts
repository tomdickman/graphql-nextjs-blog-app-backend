import { ApolloServer } from "apollo-server"
import { PrismaClient } from "@prisma/client"

import typeDefs from "./schema"
import { Query, Mutation } from "./resolvers" 
import { getUserFromToken } from "./utils/getUserFromToken"

export interface Context {
    prisma: PrismaClient
    userInfo: { userId: number } | null
}

const prisma = new PrismaClient()

const server = new ApolloServer({
    typeDefs,
    resolvers: {
        Query,
        Mutation
    },
    context: ({ req }: { req: { headers: { authorization: string } } }) => {
        const userInfo = req.headers.authorization 
            ? getUserFromToken(req.headers.authorization) 
            : null
        return {
            prisma,
            userInfo
        }
    }
})

server.listen().then(({ url }) => {
    console.log(`🚀 Server is running on: ${url}`)
})
