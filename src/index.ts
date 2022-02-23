import { PersonPublicKey, cryptoKey } from "./class/class";
import { SLIP_0044_TYPE } from "./class/slip_0044";
import { PostalAddress, Organization, Occupation } from "digital-arsenal-schema-dts";
import ICAL from "ical.js";
import atob from "atob";
import btoa from "btoa";

const createAddress = (address: PostalAddress, prefix: string = "ADR") => {

    let strAddress = address?.streetAddress?.toString().split(",") || [""];

    if (strAddress?.length < 2) {
        strAddress.push("");
    }
    strAddress = strAddress.reverse().map(c => c.trim());
    return `${prefix};type=${address.name || "work"};type=pref:${address.postOfficeBoxNumber};${strAddress[0]};${strAddress[1]};${address.addressLocality};${address.addressRegion};${address.postalCode};${address.addressCountry}\n`;
}
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
        let prop = vCardArray[k][0].toLowerCase();
        if (prop === "n") {
            let name = vCardArray[k][3];
            person.familyName = name[0];
            person.givenName = name[1];
            person.additionalName = name[2];
            person.honorificPrefix = name[3];
            person.honorificSuffix = name[4].join(",");
        }
        if (prop === "org") {
            let v = vCardArray[k][3];
            person.affiliation = {
                "@type": "Organization",
                name: v,
                legalName: v
            };
        }
        if (prop === "title") {
            let v = vCardArray[k][3];
            person.hasOccupation = v;
        }

        if (prop === "adr") {
            let v = vCardArray[k][3];
            console.log(vCardArray[k]);

            person.address = {
                "@type": "PostalAddress",
                postOfficeBoxNumber: v[0],
                streetAddress: `${v[2]}${v[1].length ? ", " + v[1] : ''}`,
                addressLocality: v[3],
                addressRegion: v[4],
                addressCountry: v[6],
                postalCode: v[5]
            }
        }

    }
    return person;
}

export const createCSV = (person: PersonPublicKey) => {

    const headers = {
        "First Name": person.givenName,
        "Middle Name": person.additionalName,
        "Last Name": person.familyName,
        "Title": person.honorificPrefix,
        "Suffix": person.honorificSuffix,
        "Nickname": "",
        "Given Yomi": "",
        "Surname Yomi": "",
        "E-mail Address": "",
        "E-mail 2 Address": "",
        "E-mail 3 Address": "",
        "Home Phone": "",
        "Home Phone 2": "",
        "Business Phone": "",
        "Business Phone 2": "",
        "Mobile Phone": "",
        "Car Phone": "",
        "Other Phone": "",
        "Primary Phone": "",
        "Pager": "",
        "Business Fax": "",
        "Home Fax": "",
        "Other Fax": "",
        "Company Main Phone": "",
        "Callback": "",
        "Radio Phone": "",
        "Telex": "",
        "TTY/TDD Phone": "",
        "IMAddress": "",
        "Job Title": "",
        "Department": "",
        "Company": "",
        "Office Location": "",
        "Manager's Name": "",
        "Assistant's Name": "",
        "Assistant's Phone": "",
        "Company Yomi": "",
        "Business Street": "",
        "Business City": "",
        "Business State": "",
        "Business Postal Code": "",
        "Business Country/Region": "",
        "Home Street": "",
        "Home City": "",
        "Home State": "",
        "Home Postal Code": "",
        "Home Country/Region": "",
        "Other Street": "",
        "Other City": "",
        "Other State": "",
        "Other Postal Code": "",
        "Other Country/Region": "",
        "Personal Web Page": "",
        "Spouse": "",
        "Schools": "",
        "Hobby": "",
        "Location": "",
        "Web Page": "",
        "Birthday": "",
        "Anniversary": "",
        "Notes": "",
    };


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

    vCard += `NOTE:-----START KEYMASTER-----${btoa(JSON.stringify(person))}-----END KEYMASTER-----\n`;
    vCard += `END:VCARD`;
    return vCard;

}