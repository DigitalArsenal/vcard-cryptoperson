import { SLIP_0044_TYPE } from "./class/slip_0044";
import { PostalAddress, Organization, Occupation, ContactPoint } from "schema-dts";
import ICAL from "ical.js";
import { keyNameMap } from "./lib/keyNameMap";
import { UPMT } from "../src/class/UPM/UPM";
import { OccupationT } from "../src/class/UPM/Occupation";
import { ContactPointT } from "../src/class/UPM/ContactPoint";
import { OrganizationT } from "../src/class/UPM/Organization";
import { CryptoKeyT } from "../src/class/UPM/CryptoKey";

const toMap: Array<string> = Object.keys(keyNameMap);
const fromMap: Array<string> = Object.values(keyNameMap);

const createAddress = (address: ContactPointT, prefix: string = "ADR", pref = false) => {

    let strAddress = address?.STREET_ADDRESS?.toString().split(",") || [""];

    if (strAddress?.length < 2) {
        strAddress.push("");
    }
    strAddress = strAddress.reverse().map(c => c.trim());
    let removeSC = (s: string) => s?.replaceAll(";", "");
    let inputs = [
        prefix,
        address.NAME || "work",
        address.POST_OFFICE_BOX_NUMBER,
        strAddress[0],
        strAddress[1],
        address.ADDRESS_LOCALITY,
        address.ADDRESS_REGION,
        address.POSTAL_CODE,
        address.ADDRESS_COUNTRY
        //@ts-ignore
    ].map(removeSC);

    return `${inputs[0]};type=${inputs[1]};${pref ? "type=pref" : ""}:${inputs[2]};${inputs[3]};${inputs[4]};${inputs[5]};${inputs[6]};${inputs[7]};${inputs[8]}\n`;
};

const readAddress = function (v: string | Array<string>, name: string | null = null): ContactPointT {

    if (!Array.isArray(v)) {
        v = v.split(";");
    }

    let postalAddress: ContactPointT = new ContactPointT();
    postalAddress.NAME = name;
    postalAddress.POST_OFFICE_BOX_NUMBER = v[0];
    postalAddress.STREET_ADDRESS = `${v[2]}${v[1].length ? ", " + v[1] : ''}`;
    postalAddress.ADDRESS_LOCALITY = v[3];
    postalAddress.ADDRESS_REGION = v[4];
    postalAddress.ADDRESS_COUNTRY = v[6];
    postalAddress.POSTAL_CODE = v[5];

    return postalAddress;
};

export const readVCARD = (input: string) => {
    var jcalData = ICAL.parse(input);
    let vCardArray = [];
    let usedKeys: {
        [key: string]: CryptoKeyT
    } = {};

    let usedItems: {
        [key: string]: {
            key: string,
            value: string,
            keyNumber: string,
            keyIndex: number,
        }
    } = {};

    let person = new UPMT();

    for (let x = 0; x < jcalData.length; x++) {

        if (jcalData[x] === "vcard") {
            vCardArray = jcalData[x + 1];
        }
    }
    for (let k = 0; k < vCardArray.length; k++) {
        let prop = vCardArray[k][0].toLowerCase();
        let v = vCardArray[k][3];

        if (prop === "email" || prop === "tel") {
            const contactType = vCardArray[k][1].type.filter((t: any) => !~["VOICE", "INTERNET"].indexOf(t))[0];
            let contactPoint = new ContactPointT();
            contactPoint.CONTACT_TYPE = contactType;
            if (prop === "email") {
                contactPoint.EMAIL = v;
            } else {
                contactPoint.TELEPHONE = v;
            }
            person.CONTACT_POINT.push(contactPoint);
        }

        if (prop.match(/item[0-9]{1,}\.adr/)) {
            const nameArray = vCardArray[k][1]?.type ? [vCardArray[k][1]?.type] : Array.isArray(vCardArray[k][1]) ? vCardArray[k][1] : [];
            const address = readAddress(
                v,
                nameArray.filter((n: string) => n.toLowerCase() !== "pref")[0]);
            person.CONTACT_POINT.push(address);
        }

        if (prop.match(/ablabel|abrelatednames/ig)) {
            let [kk1, kk2] = v.split("#");
            let itemC = prop.split(".")[0];
            let usedKeyIndex = fromMap.indexOf(kk1.trim());
            if (prop.match(/ablabel/i) && ~usedKeyIndex) {
                usedItems[itemC] = usedItems[itemC] || { key: "", keyNumber: "", value: "" };
                usedItems[itemC].key = kk1.trim();
                usedItems[itemC].keyNumber = kk2 ? kk2 : undefined;
                usedItems[itemC].keyIndex = usedKeyIndex;
            } else {
                usedItems[itemC] = usedItems[itemC] || { key: "", keyNumber: "", value: "" };
                usedItems[itemC].value = v;
            }
        }

        for (let item in usedItems) {
            const i = usedItems[item];
            if (i.key && i.value) {
                usedKeys[i.keyNumber] = usedKeys[i.keyNumber] || new CryptoKeyT();
                const propToUse: keyof CryptoKeyT = toMap[i.keyIndex] as keyof CryptoKeyT;
                //@ts-ignore
                usedKeys[i.keyNumber][propToUse] = propToUse === "ADDRESS_TYPE" ? parseInt(i.value) : i.value === "null" ? null : i.value;
            }
        };
        person.KEY = Object.values(usedKeys);

        if (prop === "n") {
            person.FAMILY_NAME = v[0];
            person.GIVEN_NAME = v[1];
            person.ADDITIONAL_NAME = v[2];
            person.HONORIFIC_PREFIX = v[3];
            person.HONORIFIC_SUFFIX = v[4] && v[4] !== "undefined" && Array.isArray(v[4]) ? v[4].join(",") : v[4] !== "undefined" ? "" : v[4];
        }

        if (prop === "org") {
            let organization = new OrganizationT();
            organization.NAME = v;
            organization.LEGAL_NAME = v;
            person.AFFILIATION = organization;
        }

        if (prop === "title") {
            let occupation = new OccupationT();
            occupation.NAME = v;
            person.HAS_OCCUPATION = occupation;
        }

        if (prop === "adr") {
            const address = readAddress(v);
            person.CONTACT_POINT.push(address);
        }

        if (prop === "photo") {
            person.IMAGE = v;
        }

        if (prop === "url") {
            person.SAME_AS = v;
        }
    }

    return person;
}

const nCheck = (v: any) => v || "";

export const createV3 = (person: UPMT, note: string = "") => {
    let affiliation = person.AFFILIATION;
    let hasOccupation = person.HAS_OCCUPATION;
    let contactPoint = person.CONTACT_POINT || [];
    let key = person.KEY;

    let vCard = `BEGIN:VCARD
VERSION:3.0
PRODID;VALUE=TEXT:-//Apple Inc.//iPhone OS 15.1.1//EN
N:${nCheck(person.FAMILY_NAME)};${nCheck(person.GIVEN_NAME)};${nCheck(person.ADDITIONAL_NAME)};${nCheck(person.HONORIFIC_PREFIX)};${nCheck(person.HONORIFIC_SUFFIX)}
FN:${nCheck(person.HONORIFIC_PREFIX)} ${nCheck(person.GIVEN_NAME)} ${nCheck(person.ADDITIONAL_NAME)} ${nCheck(person.FAMILY_NAME)}
ORG:${nCheck(affiliation?.LEGAL_NAME || affiliation?.NAME)}
TITLE:${nCheck(hasOccupation?.NAME)}
`;
    if (person.IMAGE) {
        vCard += `PHOTO;VALUE=URI:${person.IMAGE}\n`;
    }
    if (person.SAME_AS) {
        vCard += `URL:${person.SAME_AS}\n`;
    }

    for (const contact of contactPoint) {
        if (contact.EMAIL) {
            vCard += `EMAIL;type=INTERNET;type=${contact.CONTACT_TYPE}:${contact.EMAIL}\n`;
        }
        if (contact.TELEPHONE) {
            vCard += `TEL;type=${contact.CONTACT_TYPE};type=VOICE:${contact.TELEPHONE}\n`;
        }

        if (
            contact.STREET_ADDRESS ||
            contact.ADDRESS_COUNTRY ||
            contact.ADDRESS_LOCALITY ||
            contact.ADDRESS_REGION ||
            contact.POSTAL_CODE) {
            vCard += createAddress(contact, undefined, true);
        }
    }

    let itemCount: number = 1;

    for (let k = 0; k < key.length; k++) {
        let thisKey: CryptoKeyT | any = key[k];
        for (let prop in thisKey) {
            if (~toMap.indexOf(prop) && thisKey[prop]) {
                vCard += `item${itemCount}.X-ABLabel:${keyNameMap[prop]} #${k + 1}\n`;
                vCard += `item${itemCount}.X-ABRELATEDNAMES:${thisKey[prop]}\n`;
                itemCount++;
            }
        }
    }
    if (note) {
        vCard += `NOTE:${note}\n`;
    }
    vCard += `END:VCARD`;
    return vCard;
}
