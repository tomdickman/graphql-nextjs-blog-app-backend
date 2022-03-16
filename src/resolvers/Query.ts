import { Post } from "@prisma/client"
import { Context } from ".."

export const Query = {
    posts: async (_parent: any, _args: any, { prisma }: Context) => {
        try {
            const posts = await prisma.post.findMany({
                orderBy: [
                    {
                        createdAt: "desc"
                    }
                ],
                include: {
                    author: true
                }
            })

            return posts.map(post => {
                return {
                    ...post,
                    user: post.author
                }
            })
        } catch(error) {
            console.error(error)
        }
    }
}
