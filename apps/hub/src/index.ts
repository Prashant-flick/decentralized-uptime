import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage, signUpIncomingMessage } from 'common/types'
import client from "@repo/db/client";
import {v4 as uuid4} from 'uuid';
import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";
import nacl_util from "tweetnacl-util"

const wss = new WebSocketServer({port: 3001})

const availableValidators: { [validatorId: string]: { socket: WebSocket, publicKey: string}} = {};
const CALLBACKS: { [callbackId: string]: (data: IncomingMessage) => void} = {};
const paymentPerValidation = 100; //lampods

wss.on('connection', (ws)=>{
    ws.on('message', async(data)=> {
        const parsedData: IncomingMessage = JSON.parse(data.toString());
        
        switch(parsedData.type) {
            case 'signup':
                const verified = await verifyMessage(
                    `signed message for ${parsedData.payload.callbackId}, ${parsedData.payload.publicKey}`,
                    parsedData.payload.publicKey,
                    parsedData.payload.signature
                );
                if (verified) {
                    await singupHandler(ws, parsedData.payload);
                }
                break;
            case 'validate':
                CALLBACKS[parsedData.payload.callbackId]?.(parsedData);
                delete CALLBACKS[parsedData.payload.callbackId]
                break;
            default:
                console.log('wrong data type', parsedData);
                break;
        }
    })

    ws.on('error', console.error);

    ws.on('close', () => {
        console.log('websocket connection closed');
        for (const validator in availableValidators) {
            if ( availableValidators[validator].socket === ws ) {
                delete availableValidators[validator];
                break;
            }
        }
    })
})

const singupHandler = async(ws: WebSocket, {ip, publicKey, signature, callbackId}: signUpIncomingMessage) => {
    const validatorDb = await client.validator.findFirst({
        where: {
            publicKey
        }
    })
                
    if (validatorDb) {
        ws.send(JSON.stringify({
            type: 'signup',
            payload: {
                callbackId,
                validatorId: validatorDb.id
            }
        }))

        availableValidators[validatorDb.id] = {socket:ws, publicKey}
        return;
    }

    try {
        const validatorRes = await client.validator.create({
            data: {
                ip,
                publicKey,
                location: 'unknown',
                pendingPayouts: 0
            }
        })
    
        ws.send(JSON.stringify({
            type: 'signup',
            payload: {
                callbackId,
                validatorId: validatorRes.id
            }
        }))
    
        availableValidators[validatorRes.id] = {socket: ws, publicKey};
    } catch (error) {
        console.error;
    }
}

const verifyMessage = async(message: string, publiKey: string, signature: string) => {
    const messageBytes = nacl_util.decodeUTF8(message);
    
    const result = nacl.sign.detached.verify(
        messageBytes,
        new Uint8Array(JSON.parse(signature)),
        new PublicKey(publiKey).toBytes(),
    )
    
    return result;
}

setInterval(async () => {
    const websiteToMonitor = await client.website.findMany({
        where: {
            disabled: false
        }
    })

    for (const website of websiteToMonitor) {
        for (const validatorId in availableValidators) {
            const callbackId = uuid4();
            availableValidators[validatorId].socket.send(JSON.stringify({
                type: 'validate',
                payload: {
                    callbackId,
                    url: website.url,
                    websiteId: website.id
                }
            }))

            CALLBACKS[callbackId] = async(data: IncomingMessage) => {
                if (data.type==='validate') {
                    const verified = verifyMessage(
                        `Replying to ${data.payload.callbackId}`,
                        availableValidators[validatorId].publicKey,
                        data.payload.signature
                    );
                    if (!verified) {
                        return;
                    }
                    await client.$transaction(async(tx) => {
                        await tx.websiteTicks.create({
                            data: {
                                websiteId: data.payload.websiteId,
                                latency: data.payload.latency,
                                createdAt: new Date(),
                                validatorId: data.payload.validatorId,
                                status: data.payload.status
                            }
                        })

                        await tx.validator.update({
                            where: {
                                id: data.payload.validatorId
                            },
                            data: {
                                pendingPayouts: { increment: paymentPerValidation }
                            }
                        })
                    })
                }
            }
        }
    }
}, 60 * 1000);