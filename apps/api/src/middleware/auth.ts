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
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET || "Hello") as {id: string, email: string};
            req.userId = decodedToken.id;
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