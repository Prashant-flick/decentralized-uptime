import { Router } from "express"
import client from "@repo/db/client"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const authRouter = Router();

authRouter.post('/signup', async(req,res) => {
    const { email, password, confirmPassword } = req.body;
    if (!email || !password || !confirmPassword) {
        res.status(400).json({
            message: "all feilds are required"
        })
        return;
    }
    const userRes = await client.user.findUnique({
        where: {
            email
        },
    })

    if (userRes) {
        res.status(400)
        .json({
            message: "user already exists"
        })
        return;
    } else {
        try {
            const hashedPassword = bcrypt.hashSync(password, parseInt(process.env.BCRYPT_SECRET || "Hello"));
            const UserRes = await client.user.create({
                data: {
                    email,
                    password: hashedPassword
                }
            })
            res.status(200)
            .json({
                message: "user creation success",
                userId: UserRes.id
            })
        } catch (error) {
            res.status(400)
            .json({
                message: "user creation failed"
            })
        }
    }
})

const createAccessToken = (user: {id: string, email: string}) => {
    const token = jwt.sign({
      userId: user.id,
      email: user.email
    }, process.env.ACCESS_TOKEN_SECRET || "HELLO",
    {
      expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRY || "3600", 10),
    })
    
    return token;
}

const createRefreshToken = (user: {id: string, email: string}) => {
    const token = jwt.sign({
      userId: user.id,
      email: user.email
    }, process.env.REFRESH_TOKEN_SECRET || "HELLO",
    {
      expiresIn: parseInt(process.env.REFRESH_TOKEN_EXPIRY || "86400", 10),
    })
    
    return token;
}

authRouter.post('singin', async(req,res) => {
    const {email, password} = req.body
    if (!email || !password) {
        res.status(400)
        .json({
            message: "all feilds are required"
        })
    }

    const userRes = await client.user.findFirst({
        where: {
            email
        }
    })

    if (!userRes) {
        res.status(400)
        .json({
            message: "user not found"
        })
        return;
    }

    const compare = bcrypt.compareSync(password, userRes.password);
    if (!compare) {
        res.status(400)
        .json({
            message: "wrong password"
        })
        return
    }

    const accessToken = createAccessToken(userRes);
    const refreshToken = createRefreshToken(userRes);

    res.status(400)
    .json({
        "message": "user signed In",
        token: accessToken,
        userId: userRes.id
    })
})

authRouter.post('refreshToken', async(req,res) => {

})