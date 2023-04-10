import { PersonCryptoKey, CryptoKey } from "./class/class";
import { SLIP_0044_TYPE } from "./class/slip_0044";
import { PostalAddress, Organization, Occupation, ContactPoint } from "schema-dts";
import ICAL from "ical.js";
export { createCSV } from "./lib/createCSV";
import { createNote } from "./lib/createNote";
import { keyNameMap } from "./lib/keyNameMap";

const toMap: Array<string> = Object.keys(keyNameMap);
const fromMap: Array<string> = Object.values(keyNameMap);

const createAddress = (address: PostalAddress, prefix: string = "ADR") => {

    let strAddress = address?.streetAddress?.toString().split(",") || [""];

    if (strAddress?.length < 2) {
        strAddress.push("");
    }
    strAddress = strAddress.reverse().map(c => c.trim());
    let removeSC = (s: string) => s.replaceAll(";", "");
    let inputs = [
        prefix,
        address.name || "work",
        address.postOfficeBoxNumber,
        strAddress[0],
        strAddress[1],
        address.addressLocality,
        address.addressRegion,
        address.postalCode,
        address.addressCountry
        //@ts-ignore
    ].map(removeSC);

    return `${inputs[0]};type=${inputs[1]};type=pref:${inputs[2]};${inputs[3]};${inputs[4]};${inputs[5]};${inputs[6]};${inputs[7]};${inputs[8]}\n`;
}

const readAddress = function (v: string): any { //Excessive stack depth comparing types 'PostalAddressLeaf' and 'SchemaValue<IdReference | PostalAddressLeaf | Text, "address">
    return {
        "@type": "PostalAddress",
        postOfficeBoxNumber: v[0],
        streetAddress: `${v[2]}${v[1].length ? ", " + v[1] : ''}`,
        addressLocality: v[3],
        addressRegion: v[4],
        addressCountry: v[6],
        postalCode: v[5]
    } as PostalAddress;
};

export const readVCARD = (input: string) => {
    var jcalData = ICAL.parse(input);
    let vCardArray = [];
    let usedKeys: {
        [key: string]: CryptoKey
    } = {};

    let usedItems: {
        [key: string]: {
            key: string,
            value: string,
            keyNumber: string,
            keyIndex: number,
        }
    } = {};

    let person: PersonCryptoKey = {
        "@type": "Person",
        key: [{
            "@type": "CryptoKey",
            publicKey: "",

        }],
        hasOccupation: { "@type": "Occupation" },
        affiliation: { "@type": "Organization" },
        address: { "@type": "PostalAddress" },
        contactPoint: [],
        sameAs: ""
    };
    for (let x = 0; x < jcalData.length; x++) {

        if (jcalData[x] === "vcard") {
            vCardArray = jcalData[x + 1];
        }
    }
    for (let k = 0; k < vCardArray.length; k++) {
        let prop = vCardArray[k][0].toLowerCase();
        let v = vCardArray[k][3];
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
            if (i.key && i.value && i.key !== "Digital Signature") {
                usedKeys[i.keyNumber] = usedKeys[i.keyNumber] || { "@type": "CryptoKey" };
                const propToUse: keyof CryptoKey = toMap[i.keyIndex] as keyof CryptoKey;
                //@ts-ignore
                usedKeys[i.keyNumber][propToUse] = propToUse === "addressType" ? parseInt(i.value) : i.value;
            } else if (i.key === "Digital Signature") {
                person.signature = i.value;
            }
        }
        person.key = Object.values(usedKeys);

        if (prop === "n") {
            person.familyName = v[0];
            person.givenName = v[1];
            person.additionalName = v[2];
            person.honorificPrefix = v[3];
            person.honorificSuffix = v[4] && v[4] !== "undefined" && Array.isArray(v[4]) ? v[4].join(",") : v[4] !== "undefined" ? "" : v[4];
        }

        if (prop === "org") {
            person.affiliation = {
                "@type": "Organization",
                name: v,
                legalName: v
            };
        }
        if (prop === "title") {
            person.hasOccupation = {
                "@type": "Occupation",
                "name": v
            };
        }

        if (prop === "adr") {
            person.address = readAddress(v)
        }
    }

    return person;
}

export const createV3 = (person: PersonCryptoKey, appendJSON: boolean = false) => {
    //@ts-ignore
    let {
        familyName,
        givenName,
        honorificPrefix,
        honorificSuffix,
        additionalName,
        signature
    } = person;

    let affiliation = person.affiliation as Exclude<Organization, string> || {};
    let hasOccupation = person.hasOccupation as Exclude<Occupation, string> || {};
    let address = person.address as PostalAddress;
    let contactPoint = person.contactPoint as Array<any> || [];
    let key = person.key as Array<CryptoKey>;

    let vCard = `BEGIN:VCARD
VERSION:3.0
PRODID;VALUE=TEXT:-//Apple Inc.//iPhone OS 15.1.1//EN
N:${familyName};${givenName};${additionalName};${honorificPrefix};${honorificSuffix}
FN:${honorificPrefix} ${givenName} ${additionalName} ${familyName}
ORG:${affiliation.legalName || affiliation.name}
TITLE:${hasOccupation.name}
`;
    if (address) {
        vCard += createAddress(address);
    }
    let itemCount: number = 1;

    if (signature) {
        vCard += `item${itemCount}.X-ABLabel:Digital Signature\n`;
        vCard += `item${itemCount}.X-ABRELATEDNAMES:${signature}\n`;
        itemCount++;
    }

    for (let c = 0; c < contactPoint.length; c++) {
        let contact: any = contactPoint[c];

        if (contact.email) {
            vCard += `EMAIL;type=INTERNET;type=${contact.contactType}:${contact.email}\n`;
        }
        if (contact.telephone) {
            vCard += `TEL;type=${contact.contactType};type=VOICE:${contact.telephone}\n`;
        }
        if (contact["@type"] === "PostalAddress") {
            vCard += createAddress(contact, `item${itemCount++}.ADR`);
        }
    }

    for (let k = 0; k < key.length; k++) {
        let thisKey: CryptoKey | any = key[k];
        for (let prop in thisKey) {
            if (~toMap.indexOf(prop)) {
                vCard += `item${itemCount}.X-ABLabel:${keyNameMap[prop]} #${k + 1}\n`;
                vCard += `item${itemCount}.X-ABRELATEDNAMES:${thisKey[prop]}\n`;
                itemCount++;
            }

        }
    }
    if (appendJSON) {
        vCard += `NOTE:${createNote(person)}\n`;
    }
    vCard += `END:VCARD`;
    return vCard;

}
