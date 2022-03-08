import { ApolloServer } from "apollo-server"
import { PrismaClient } from "@prisma/client"

import typeDefs from "./schema"
import { Query, Mutation } from "./resolvers" 

export interface Context {
    prisma: PrismaClient
}

const context: Context = {
    prisma: new PrismaClient()
}

const server = new ApolloServer({
    typeDefs,
    resolvers: {
        Query,
        Mutation
    },
    context: context
})

server.listen().then(({ url }) => {
    console.log(`🚀 Server is running on: ${url}`)
})
