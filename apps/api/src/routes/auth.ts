import { Router } from "express"
import client from "@repo/db/client"
import bcrypt from 'bcryptjs'
import jwt, {SignOptions} from 'jsonwebtoken'

export const authRouter = Router();

type expiresInType = `${number}${'M'|'Y'|'D'}`;

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
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY as expiresInType
    })
    return token;
}

const createRefreshToken = (user: {id: string, email: string}) => {
    const token = jwt.sign({
      userId: user.id,
      email: user.email
    },process.env.REFRESH_TOKEN_SECRET || "Hello",
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY as expiresInType,
    })
    return token;
}

authRouter.post('/refresh', async(req, res) => {
    const refreshToken = req.cookies.refreshToken as string;
     
    if (!refreshToken) {
        res.status(400)
        .json({
            message: "refresh token expired"
        })
        return;
    }

    const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || "Hello") as { userId:string, email: string}
    const accessToken = createAccessToken({id: decodedToken.userId, email: decodedToken.email});
    res.status(200)
    .json({
        accessToken,
        userId: decodedToken.userId
    })
})

authRouter.post('/signin', async(req,res) => {
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

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV==='production',
        sameSite: 'strict',
        path: '/'
    });

    res.status(200)
    .json({
        "message": "user signed In",
        token: accessToken,
        userId: userRes.id
    })
})

authRouter.post('/signout', async(req,res) => {
    res.clearCookie('refreshToken', {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV==='production'
    })

    res.status(200)
    .json({
        message: "signout success"
    })
})