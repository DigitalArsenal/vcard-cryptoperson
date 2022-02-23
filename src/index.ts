import { PersonPublicKey, cryptoKey } from "./class/class";
import { SLIP_0044_TYPE } from "./class/slip_0044";
import { PostalAddress, Organization, Occupation } from "digital-arsenal-schema-dts";
import ICAL from "ical.js";
import atob from "atob";
import btoa from "btoa";

const createAddress = (address: PostalAddress, prefix: string = "ADR") => `${prefix};type=${address.name || "work"};type=pref:;${address.postOfficeBoxNumber};${address.streetAddress};${address.addressLocality};${address.addressRegion};${address.postalCode};${address.addressCountry}\n`;

export const readVCARD = (input: string) => {
    var jcalData = ICAL.parse(input);
    let isVCard = false;
    let vCardArray = [];
    let person: PersonPublicKey = {
        "@type": "Person",
        key: {
            "@type": "CryptoKey",
            publicKey: "",
        }
    };
    for (let x = 0; x < jcalData.length; x++) {

        if (jcalData[x] === "vcard") {
            vCardArray = jcalData[x + 1];
        }
    }
    for (let k = 0; k < vCardArray.length; k++) {
        if (vCardArray[k][0] === "n") {
            let name = vCardArray[k][3];
            person.familyName = name[0];
            person.givenName = name[1];
            person.additionalName = name[2];
            person.honorificPrefix = name[3];
            person.honorificSuffix = name[4].join(",");
        }
        if (vCardArray[k][0] === "org") {
            let v = vCardArray[k][3];
            person.affiliation = {
                "@type": "Organization",
                name: v,
                legalName: v
            };
        }
        if (vCardArray[k][0] === "title") {
            let v = vCardArray[k][3];
            person.hasOccupation = v;
        }
    }
    return person;
}

export const createV3 = (person: PersonPublicKey, appendJSON: boolean = true) => {
    //@ts-ignore
    let {
        familyName,
        givenName,
        honorificPrefix,
        honorificSuffix,
        additionalName,
    } = person;

    let affiliation = person.affiliation as Organization;
    let hasOccupation = person.hasOccupation as Occupation;
    let address = person.address as PostalAddress;
    let contactPoint = person.contactPoint as Array<any>;
    let key = person.key as Array<cryptoKey>;

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
        let thisKey: cryptoKey = key[k];
        vCard += `item${itemCount}.X-ABRELATEDNAMES:${thisKey.publicKey}\n`;
        vCard += `item${itemCount}.X-ABLabel:cryptoKey_${k} publicKey\n`;
        itemCount++;
        vCard += `item${itemCount}.X-ABRELATEDNAMES:${thisKey.keyAddress}\n`;
        vCard += `item${itemCount}.X-ABLabel:cryptoKey_${k} keyAddress\n`;
        itemCount++;
        vCard += `item${itemCount}.X-ABRELATEDNAMES:${SLIP_0044_TYPE[thisKey.keyType as number]},${thisKey.keyType}\n`;
        vCard += `item${itemCount}.X-ABLabel:cryptoKey_${k} keyType\n`;
    }

    if (appendJSON) {
        itemCount++;
        vCard += `item${itemCount}.X-ABRELATEDNAMES:${btoa(JSON.stringify(person))}\n`;
        vCard += `item${itemCount}.X-ABLabel:Instance_ID\n`;
    }

    vCard += `END:VCARD`;
    return vCard;

}