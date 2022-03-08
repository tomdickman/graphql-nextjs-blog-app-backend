import JWT, { Secret } from "jsonwebtoken"
import "dotenv/config"

export const getUserFromToken = (token: string) => {
    try {
        const result = JWT.verify(token, process.env.JWT_KEY as Secret) as {
            userId: number
        }

        return result
    } catch(error) {
        return null
    }
}