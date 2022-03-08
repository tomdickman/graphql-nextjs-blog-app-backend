import { gql } from "apollo-server"

const typeDefs = gql`
    type Query {
        posts: [Post!]!
    }

    type Mutation {
        postCreate(title: String!, content: String!): PostPayload!
        postUpdate(id: ID!, post: PostUpdateInput!): PostPayload!
    }

    type Post {
        id: ID!
        title: String!
        content: String!
        published: Boolean!
        user: User!
    }

    type PostPayload {
        userErrors: [UserError!]!
        post: Post
    }

    input PostUpdateInput {
        title: String
        content: String
        published: Boolean
    }

    type UserError {
        message: String!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        profile: Profile
        posts: [Post!]!
    }

    type Profile {
        id: ID!
        bio: String!
        user: User!
    }
`

export default typeDefs
