import { Post } from "@prisma/client"
import { Context } from ".."

export const Query = {
    posts: (_parent: any, _args: any, { prisma }: Context) => {
        try {
            return prisma.post.findMany({
                orderBy: [
                    {
                        createdAt: "desc"
                    }
                ],
            })
        } catch(error) {
            console.error(error)
        }
    }
}
