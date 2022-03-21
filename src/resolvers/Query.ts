import { Post } from "@prisma/client"
import { Context } from ".."

export const Query = {
    posts: async (_parent: any, _args: any, { prisma, userInfo }: Context) => {
        let posts: Post[] = []
        const userErrors = []

        if (!userInfo || !userInfo.userId) {
            userErrors.push(new Error("not authorized"))
        } else {
            try {
                posts = await prisma.post.findMany({
                    where: {
                        id: Number(userInfo.userId)
                    },
                    orderBy: [
                        {
                            createdAt: "desc"
                        }
                    ],
                    include: {
                        author: true
                    }
                })
            } catch(error) {
                console.error(error)
            }
        }

        return {
            posts,
            userErrors,
        }
    }
}
