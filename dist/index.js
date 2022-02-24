import { SLIP_0044_TYPE } from "./class/slip_0044";
import ICAL from "ical.js";
import atob from "atob";
import btoa from "btoa";
const createAddress = (address, prefix = "ADR") => {
    let strAddress = address?.streetAddress?.toString().split(",") || [""];
    if (strAddress?.length < 2) {
        strAddress.push("");
    }
    strAddress = strAddress.reverse().map(c => c.trim());
    let removeSC = (s) => s.replaceAll(";", "");
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
};
const readAddress = function (v) {
    return {
        "@type": "PostalAddress",
        postOfficeBoxNumber: v[0],
        streetAddress: `${v[2]}${v[1].length ? ", " + v[1] : ''}`,
        addressLocality: v[3],
        addressRegion: v[4],
        addressCountry: v[6],
        postalCode: v[5]
    };
};
const createNote = (person) => {
    return `-----START KEYMASTER-----${btoa(JSON.stringify(person))}-----END KEYMASTER-----`;
};
export const readVCARD = (input) => {
    var jcalData = ICAL.parse(input);
    let vCardArray = [];
    let person = {
        "@type": "Person",
        key: {
            "@type": "CryptoKey",
            keyAddress: "",
        },
        contactPoint: []
    };
    for (let x = 0; x < jcalData.length; x++) {
        if (jcalData[x] === "vcard") {
            vCardArray = jcalData[x + 1];
        }
    }
    for (let k = 0; k < vCardArray.length; k++) {
        let prop = vCardArray[k][0].toLowerCase();
        let v = vCardArray[k][3];
        if (prop === "n") {
            person.familyName = v[0];
            person.givenName = v[1];
            person.additionalName = v[2];
            person.honorificPrefix = v[3];
            person.honorificSuffix = v[4].join(",");
        }
        if (prop === "org") {
            person.affiliation = {
                "@type": "Organization",
                name: v,
                legalName: v
            };
        }
        if (prop === "title") {
            person.hasOccupation = v;
        }
        if (prop === "adr") {
            person.address = readAddress(v);
        }
        if (prop === "note") {
            let sPerson = JSON.parse(atob(v.match(/(-----START KEYMASTER-----)(.*)(-----END KEYMASTER-----)/)[2]));
            person = sPerson;
            break;
        }
    }
    return person;
};
export const createCSV = (person) => {
    let stripComma = (a) => {
        if (a) {
            return a.replaceAll(",", "");
        }
        else {
            return "";
        }
    };
    let inputs = [
        person.givenName,
        person.additionalName,
        person.familyName,
        person.honorificPrefix,
        person.honorificSuffix
    ];
    let homeAddress = { "@type": "PostalAddress" }, businessAddress = { "@type": "PostalAddress" };
    let cPA = person.contactPoint;
    if (cPA?.length) {
        for (let cP = 0; cP < cPA.length; cP++) {
            if (cPA[cP]["@type"] === "PostalAddress") {
                if (cPA[cP].name === "home") {
                    homeAddress = cPA[cP];
                }
                else if (cPA[cP].name === "work") {
                    businessAddress = cPA[cP];
                }
            }
        }
    }
    inputs = inputs.map(stripComma);
    const headers = {
        "First Name": inputs[0],
        "Middle Name": inputs[1],
        "Last Name": inputs[2],
        "Title": inputs[3],
        "Suffix": inputs[4],
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
        "IMAddress": "bc1q54xdp0rtaxa7aehh9flnav2e4gqdfyeru38zep bc1q54xap0rtaxa7aehh9flnav2e4gqdfyeru38zep",
        "Job Title": "",
        "Department": "",
        "Company": "",
        "Office Location": "",
        "Manager's Name": "",
        "Assistant's Name": "",
        "Assistant's Phone": "",
        "Company Yomi": "",
        "Business Street": `${businessAddress.postOfficeBoxNumber ? businessAddress.postOfficeBoxNumber + " " : ""}${businessAddress.streetAddress}`,
        "Business City": businessAddress.addressLocality,
        "Business State": businessAddress.addressRegion,
        "Business Postal Code": businessAddress.addressCountry,
        "Business Country/Region": businessAddress.addressCountry,
        "Home Street": `${homeAddress.postOfficeBoxNumber ? homeAddress.postOfficeBoxNumber + " " : ""}${homeAddress.streetAddress}`,
        "Home City": homeAddress.addressLocality,
        "Home State": homeAddress.addressRegion,
        "Home Postal Code": homeAddress.addressCountry,
        "Home Country/Region": homeAddress.addressCountry,
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
        "Notes": createNote(person),
    };
    //@ts-ignore
    return [Object.keys(headers), Object.values(headers)].join("\n");
};
export const createV3 = (person, appendJSON = true, extendedKeyMetadata = false) => {
    //@ts-ignore
    let { familyName, givenName, honorificPrefix, honorificSuffix, additionalName, } = person;
    let affiliation = person.affiliation;
    let hasOccupation = person.hasOccupation;
    let address = person.address;
    let contactPoint = person.contactPoint;
    let key = person.key;
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
    let itemCount = 1;
    for (let c = 0; c < contactPoint.length; c++) {
        let contact = contactPoint[c];
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
        let thisKey = key[k];
        vCard += `item${itemCount}.X-ABRELATEDNAMES:${thisKey.keyAddress}\n`;
        vCard += `item${itemCount}.X-ABLabel:cryptoKey_${k} keyAddress\n`;
        if (extendedKeyMetadata) {
            itemCount++;
            vCard += `item${itemCount}.X-ABRELATEDNAMES:${thisKey.publicKey}\n`;
            vCard += `item${itemCount}.X-ABLabel:cryptoKey_${k} publicKey\n`;
            itemCount++;
            vCard += `item${itemCount}.X-ABRELATEDNAMES:${SLIP_0044_TYPE[thisKey.keyType]},${thisKey.keyType}\n`;
            vCard += `item${itemCount}.X-ABLabel:cryptoKey_${k} keyType\n`;
        }
    }
    if (appendJSON) {
        vCard += `NOTE:${createNote(person)}\n`;
    }
    vCard += `END:VCARD`;
    return vCard;
};
