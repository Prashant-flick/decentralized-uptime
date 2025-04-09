import express from 'express';
import client from '@repo/db/client'
import dotenv from 'dotenv'
import { authMiddleware } from './middleware/auth';
import { authRouter } from './routes/auth';
import cors from 'cors'
import cookieParser from 'cookie-parser'

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(cookieParser());

app.use("/api/v1", authRouter);

app.post("/api/v1/website", authMiddleware, async(req, res) => {
    const url = req.body.url;
    if (!url) {
        res.status(400)
        .json({
            message: "url is required"
        })
    } else {
        const websiteRes = await client.website.findFirst({
            where: {
                url
            }
        })

        if (websiteRes) {
            if (websiteRes.disabled) {
                try {
                    await client.website.update({
                        where: {
                            id: websiteRes.id
                        },
                        data: {
                            disabled: true
                        }
                    })

                    res.status(200)
                    .json({
                        message: "website created succesfully"
                    })
                } catch (error) {
                    res.status(400)
                    .json({
                        message: "website creation failed"
                    })   
                }
            } else {
                res.status(400)
                .json({
                    message: "website already exists"
                })
            }
            return;
        } else {
            try {
                await client.website.create({
                    data: {
                        url,
                        creatorId: req.userId!
                    }
                })
                res.status(200)
                .json({
                    message: "website created succesfully"
                })
            } catch (error) {
                res.status(400)
                .json({
                    message: "website already exists"
                })
            }
            return;
        }
    }

})

app.get("/api/v1/website/ticks", authMiddleware, async(req,res)=>{
    const websiteId = req.query.websiteId as unknown as string;
    if (!websiteId) {
        res.status(400)
        .json({
            message: "website id required"
        })
    } else {
        try {
            const websiteRes = await client.website.findFirst({
                where: {
                    id: websiteId,
                    creatorId: req.userId!
                },
                include: {
                    ticks: true
                }
            })
            res.status(200)
            .json(websiteRes)
        } catch (error) {
            res.status(400)
            .json({
                message: "website ticks fetching failed"
            })
        }

        
    }
})

app.get("/api/v1/websites", authMiddleware, async(req,res) => {
    try {
        const websiteRes = await client.website.findMany({
            where: {
                creatorId: req.userId
            }
        })
        res.status(200)
        .json(websiteRes)
    } catch (error) {
        res.status(404)
        .json({
            message: "website fetching failed"
        })
    }
})

app.delete("/api/v1/website", authMiddleware, async(req,res) => {
    const websiteId = req.query.websiteId as unknown as string;
    if (!websiteId) {
        res.status(400)
        .json({
            message: "websiteId is required"
        })
        return;
    }
    try {
        await client.website.update({
            where: {
                id: websiteId,
                creatorId: req.userId!
            },
            data: {
                disabled: true
            }
        })
        res.status(200)
        .json({
            message: "website deletion success"
        })
    } catch (error) {
        res.status(400)
        .json({
            message: "website deletion failed"
        })
    }
})

app.listen(3000, ()=>{
    console.log('server is running on port 3000');
})