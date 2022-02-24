import { Person } from "schema-dts";
import { SLIP_0044_TYPE } from "./slip_0044";

export type cryptoKeyBase = {
    //hex publicKey
    publicKey?: string,
    privateKey?: string,
    keyAddress: string,
    //https://github.com/satoshilabs/slips/blob/master/slip-0044.md
    keyType?: SLIP_0044_TYPE | number
}

export interface cryptoKey extends cryptoKeyBase {
    "@type": "CryptoKey",
}

export type PersonCryptoKey = Exclude<Person, string> & {
    key: cryptoKey | Array<cryptoKey>
}