import { Person } from "schema-dts";
import { SLIP_0044_TYPE } from "./slip_0044";

export type CryptoKeyBase = {
    //hex publicKey
    publicKey: string,
    signature?: string,
    privateKey?: string,
    keyAddress?: string,
    //https://github.com/satoshilabs/slips/blob/master/slip-0044.md
    keyType?: SLIP_0044_TYPE | number
}

export interface CryptoKey extends CryptoKeyBase {
    "@type": "CryptoKey",
}

export type PersonCryptoKey = Exclude<Person, string> & {
    key: Array<CryptoKey>
}