import { gql } from "apollo-server"

const typeDefs = gql`
    type Query {
        posts: [Post!]!
    }

    type Mutation {
        postCreate(title: String!, content: String!): PostPayload!
        postUpdate(id: ID!, post: PostUpdateInput!): PostPayload!
        postDelete(id: ID!): PostPayload!
        signup(input: SignUpInput!): UserPayload!
        signin(input: SignInInput!): UserPayload!
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

    type UserPayload {
        token: String,
        userErrors: [UserError!]!
    }

    type Profile {
        id: ID!
        bio: String!
        user: User!
    }

    input SignUpInput {
        email: String!
        name: String!
        bio: String!
        password: String!
    }

    input SignInInput {
        email: String!
        password: String!
    }
`

export default typeDefs
