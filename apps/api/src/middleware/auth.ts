import {Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

export const authMiddleware = async(req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    
    if (!token) {
        res.status(403)
        .json({
            message: "unauthorized access"
        })
        return;
    } else {
        try {
            const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "Hello") as {userId: string, email: string};
            req.userId = decodedToken.userId;
            next();
        } catch (error) {
            res.status(403)
            .json({
                message: "unauthorized access"
            })
            return;
        }
    }
}