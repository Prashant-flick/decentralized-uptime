import { Request } from "express"

export interface Req extends Request{
    userId: string
}