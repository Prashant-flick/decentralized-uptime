import { v4 as uuid4 } from 'uuid';
import { Keypair } from "@solana/web3.js";
import nacl from 'tweetnacl';
import nacl_util from 'tweetnacl-util';
import { OutGoingMessage, signUpOutGoingMessage, validateOutGoingMessage } from 'common/src/types';

const CALLBACKS: {[callbackId: string]: (data: signUpOutGoingMessage) => void} = {};
let validatorId: string | null = null; 
const keypair = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(process.env.PRIVATE_KEY!))
);

const main = async() => {
    const ws = new WebSocket("ws://localhost:3001");
    ws.onmessage = async(event) => {
        const parsedData: OutGoingMessage = JSON.parse(event.data);
        switch(parsedData.type){
            case 'signup':
                CALLBACKS[parsedData.payload.callbackId]?.(parsedData.payload)
                delete CALLBACKS[parsedData.payload.callbackId]
                break;
            case 'validate':
                await validateHandler(ws, parsedData.payload, keypair);
                break;
            default:
                console.log('wrong data type', parsedData);
                break;
        }
    }

    ws.onopen = async() => {
        const callbackId = uuid4();
        CALLBACKS[callbackId] = (data: signUpOutGoingMessage) => {
            validatorId = data.validatorId;
        }

        const signedMessage = await signMessage(`Signed Message for ${callbackId}`, keypair)
        ws.send(JSON.stringify({
            type: 'signup',
            payload: {
                callbackId,
                PublicKey: keypair.publicKey,
                signature: signedMessage
            }
        }));
    }

    ws.close = () => {
        console.log('websocket closed');
    }
}

const signMessage = async(message: string, keypair: Keypair) => {
    const messageBytes = nacl_util.decodeUTF8(message);
    const signature = nacl.sign.detached(messageBytes, keypair.secretKey)
    return JSON.stringify(Array.from(signature))
}

const validateHandler = async(socket: WebSocket, {url, websiteId, callbackId}: validateOutGoingMessage, keypair: Keypair) => {
    const startTime = Date.now();
    const signature = await signMessage(`Replying to ${callbackId}`, keypair);

    try {
        const responce = await fetch(url);
        const latency = Date.now() - startTime;
        const status = responce.status;

        socket.send(JSON.stringify({
            type: 'validate',
            payload: {
                status: status===200?'Good':'Bad',
                callbackId,
                latency,
                signature,
                websiteId,
                validatorId
            }
        }))
    } catch (error) {
        socket.send(JSON.stringify({
            type: 'validate',
            payload: {
                status: 'Bad',
                callbackId,
                latency: 1000,
                signature,
                websiteId,
                validatorId
            }
        }))
        console.error(error);
    }
}

main();

setInterval(async() => {
    
}, 10000);