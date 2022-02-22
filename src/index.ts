import { PersonPublicKey, cryptoKey } from "./class/class";
import { SLIP_0044_TYPE } from "./class/slip_0044";
import { PostalAddress, Organization, Occupation } from "digital-arsenal-schema-dts";

const createAddress = (address: PostalAddress, prefix: string = "ADR") => `${prefix};type=${address.name || "work"};type=pref:;${address.postOfficeBoxNumber};${address.streetAddress};${address.addressLocality};${address.addressRegion};${address.postalCode};${address.addressCountry}\n`;

export const createV3 = (person: PersonPublicKey, format: string = "vcalendar", appendJSON: boolean = true) => {
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
        vCard += `item${itemCount}.X-ABLabel:cryptoKey_${0} publicKey\n`;
        itemCount++;
        vCard += `item${itemCount}.X-ABRELATEDNAMES:${thisKey.keyAddress}\n`;
        vCard += `item${itemCount}.X-ABLabel:cryptoKey_${0} keyAddress\n`;
        itemCount++;
        vCard += `item${itemCount}.X-ABRELATEDNAMES:${SLIP_0044_TYPE[thisKey.keyType as number]},${thisKey.keyType}\n`;
        vCard += `item${itemCount}.X-ABLabel:cryptoKey_${0} keyType\n`;
    }

    if (appendJSON) {
        itemCount++;
        vCard += `item${itemCount}.X-ABRELATEDNAMES:${btoa(JSON.stringify(person))}\n`;
        vCard += `item${itemCount}.X-ABLabel:Instance_ID\n`;
    }

    vCard += `END:VCARD`;
    return vCard;

}