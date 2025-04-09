
export type IncomingMessage = {
    type: 'singup',
    payload: signUpIncomingMessage,
} | {
    type: 'validate',
    payload: validateIncomingMessage,
}

export type OutGoingMessage = {
    type: 'validate',
    payload: validateOutGoingMessage,
} | {
    type: 'signup',
    payload: signUpOutGoingMessage,
}

export type signUpIncomingMessage = {
    publicKey: string,
    signature: string,
    ip: string,
    callbackId: string,
}

export type validateIncomingMessage = {
    callbackId: string,
    signedMessage: string,
    status: 'Good' | 'Bad',
    latency: number,
    websiteId: string,
    validatorId: string
}

export type validateOutGoingMessage = {
    callbackId: string,
    url: string,
    websiteId: string
}

export type signUpOutGoingMessage = {
    callbackId: string, 
    validatorId: string
}