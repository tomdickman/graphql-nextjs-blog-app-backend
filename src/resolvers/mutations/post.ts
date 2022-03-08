import { Context } from "../..";
import { Post } from "@prisma/client";

export interface PostCreateArgs {
    title: string,
    content: string
}

export interface PostDeleteArgs {
    id: string
}

export interface PostPayload {
    userErrors: { message: String }[],
    post: Post | null

}

export interface PostUpdateArgs {
    id: string
    post: {
        title?: string,
        content?: string,
        published?: boolean,
    }
}

export const postMutations = {
    postCreate: async (
        _parent: any,
        { title, content }: PostCreateArgs,
        { prisma, userInfo }: Context
    ): Promise<PostPayload> => {
        const errors: Error[] = []
        let post = null

        if (!userInfo || !userInfo.userId) {
            errors.push(new Error("not authorized"))
        }

        if (!title || !content) {
            errors.push(new Error("missing required param"))
        } else if (errors.length === 0) {
            try {
                post = await prisma.post.create({
                    data: {
                        title,
                        content,
                        authorId: userInfo?.userId as number
                    }
                })
            } catch (error) {
                errors.push(new Error("Prisma error creating a Post"))
            }
        }

        return {
            userErrors: errors.map(error => {
                return { message: error.message}
            }),
            post
        }
    },
    postDelete: async (
        _parent: any,
        { id }: PostDeleteArgs,
        { prisma }: Context
    ): Promise<PostPayload> => {
        const errors: Error[] = []
        let deletedPost = null

        try {
            deletedPost = await prisma.post.delete({
                where: {
                    id: Number(id)
                },
            })
        } catch (error) {
            errors.push(new Error("Prisma error deleting a Post"))
        }

        return {
            userErrors: errors.map(error => {
                return { message: error.message}
            }),
            post: deletedPost
        }
    },
    postUpdate: async (
        _parent: any,
        { id, post }: PostUpdateArgs,
        { prisma }: Context
    ): Promise<PostPayload> => {
        const errors: Error[] = []
        let updatedPost = null

        try {
            updatedPost = await prisma.post.update({
                where: {
                    id: Number(id)
                },
                data: {
                    ...post
                }
            })
        } catch (error) {
            errors.push(new Error("Prisma error updating a Post"))
        }

        return {
            userErrors: errors.map(error => {
                return { message: error.message}
            }),
            post: updatedPost
        }
    }
}
