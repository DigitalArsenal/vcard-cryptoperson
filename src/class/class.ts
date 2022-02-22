import { Person, ContactPoint } from "digital-arsenal-schema-dts";


export type cryptoKeyBase = {
    //hex publicKey
    key: string,
    keyAddress?: string,
    //https://github.com/satoshilabs/slips/blob/master/slip-0044.md
    keyType?: number
}

export interface cryptoKey extends cryptoKeyBase {
    "@type": "CryptoKey",
}

export type PersonPublicKey = Person & {
    key: cryptoKey | Array<cryptoKey>
}