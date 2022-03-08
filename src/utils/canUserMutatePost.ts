import { prisma } from "@prisma/client"
import { Context } from ".."

export type canUserMutatePostArgs = {
    userId: number
    postId: number
    prisma: Context["prisma"]
}

export const canUserMutatePost = async ({ 
    userId,
    postId,
    prisma
}: canUserMutatePostArgs) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        }
    })

    if (!user) return false

    const post = await prisma.post.findUnique({
        where: {
            id: postId,
        }
    })

    if (post?.authorId === userId) return true

    return false
}