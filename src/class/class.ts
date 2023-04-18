import { ContactPoint, Person } from "schema-dts";
import { SLIP_0044_TYPE } from "./slip_0044";

export type ContactPointPref = Partial<ContactPoint> & {
    pref?: boolean;
}

export type CryptoKeyBase = {
    //hex publicKey
    publicKey: string,
    xpub?: string,
    privateKey?: string,
    xpriv?: string,
    keyAddress?: string,
    //https://github.com/satoshilabs/slips/blob/master/slip-0044.md
    addressType?: SLIP_0044_TYPE | number
}

export interface CryptoKey extends CryptoKeyBase {
    "@type": "CryptoKey",
}

export type PersonCryptoKey = Exclude<Person, string> & {
    key: Array<CryptoKey>
    signature?: string,
    contactPoint: Array<ContactPointPref>
}