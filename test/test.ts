

import { writeFile, writeFileSync } from "fs";
import { PersonCryptoKey } from "../src/class/class";
import { SLIP_0044_TYPE } from "../src/class/slip_0044";
import { createV3, readVCARD, createCSV } from "../src/index";

let myPerson: PersonCryptoKey = {
    "@type": "Person",
    "key": [
        {
            "@type": "CryptoKey",
            "publicKey": "03E9873D79C6D87DC0FB6A5778633389F4453213303DA61F20BD67FC233AA33262",
            "keyAddress": "bc1qyzxdu4px4jy8gwhcj82zpv7qzhvc0fvumgnh0r",
            "addressType": 0
        },
        {
            "@type": "CryptoKey",
            "publicKey": "03b7b4d57a2adb4adda5e7b43132546f7ea3bbc8457e85913efbc44c8bd0eafd9d",
            "keyAddress": "bc1q54xap0rtaxa7aehh9flnav2e4gqdfyeru38zep",
            "addressType": 0
        }
    ],
    "hasOccupation": {
        "@type": "Occupation",
        "name": "Scientist"
    },
    "affiliation": {
        "@type": "Organization",
        "name": "Canada Pharma., Inc",
        "legalName": "Canada Pharma., Inc"
    },
    contactPoint: [
        {
            "@type": "PostalAddress",
            "name": "home",
            postOfficeBoxNumber: "",
            streetAddress: "2875 Laurier, Suite D2-630",
            addressLocality: "Quebec",
            addressRegion: "QC",
            addressCountry: "Canada",
            postalCode: "G1V 2M2"
        },
        {
            "@type": "ContactPoint",
            "contactType": "home",
            "telephone": "(864) 986-0602",
        },
        {
            "@type": "ContactPoint",
            "contactType": "work",
            "email": "home@email.com",
        },
    ],
    "sameAs": "",
    "familyName": "Perrault",
    "givenName": "Simon",
    "additionalName": "J",
    "honorificPrefix": "Dr.",
    "honorificSuffix": "ing. jr, M.Sc.",
    "signature": "everything_but_signature_stringified_and_signed",
};

let v3Card = createV3(myPerson);
let readCard = readVCARD(v3Card);

writeFileSync("./test/test1.json", JSON.stringify(myPerson, null, 4));
writeFileSync("./test/test2.json", JSON.stringify(readCard, null, 4))

let v3CSV = createCSV(myPerson);
let vcard3Path = "./test/vcard3.vcf";
let vcard3CSVPath = "./test/vcard3.csv";

writeFile(vcard3Path, v3Card, () => {
    console.log('vCard written to ' + vcard3Path)
});

writeFile(vcard3CSVPath, v3CSV, () => {
    console.log('vCard written to ' + vcard3Path)
});

if (JSON.stringify(myPerson) !== JSON.stringify(readCard)) {
    throw Error("Does Not Match");
}