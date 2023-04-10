

import { writeFile } from "fs";
import { PersonCryptoKey } from "../src/class/class";
import { SLIP_0044_TYPE } from "../src/class/slip_0044";
import { createV3, readVCARD, createCSV } from "../src/index";

let myPerson: PersonCryptoKey = {
    "@type": "Person",
    "key": [
        {
            "@type": "CryptoKey",
            "publicKey": "03E9873D79C6D87DC0FB6A5778633389F4453213303DA61F20BD67FC233AA33262",
            "signature": "03E9873D7...233AA33262_signature",
            "keyAddress": "bc1qyzxdu4px4jy8gwhcj82zpv7qzhvc0fvumgnh0r",
            "addressType": 0
        },
        {
            "@type": "CryptoKey",
            "publicKey": "03b7b4d57a2adb4adda5e7b43132546f7ea3bbc8457e85913efbc44c8bd0eafd9d",
            "signature": "03b7b4d57...8bd0eafd9d_signature",
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
    "address": {
        "@type": "PostalAddress",
        "postOfficeBoxNumber": "",
        "streetAddress": "1111 Work Street, Suite D1-630",
        "addressLocality": "Quebec",
        "addressRegion": "QC",
        "addressCountry": "Canada",
        "postalCode": "G1V 2M2"
    },
    contactPoint: [/*
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
            "name": "mobile",
            "telephone": "(864) 986-0602",
            "email": "mobile@email.com"
        },
        {
            "@type": "ContactPoint",
            "name": "home",
            "contactType": "work",
            "telephone": "(555) 986-0602",
            "email": "home@email.com",
        },*/
    ],
    "sameAs": "",
    "familyName": "Perrault",
    "givenName": "Simon",
    "additionalName": "J",
    "honorificPrefix": "Dr.",
    "honorificSuffix": "ing. jr, M.Sc."
};

let v3Card = createV3(myPerson);
let readCard = readVCARD(v3Card);

if (JSON.stringify(myPerson, null, 4) !== JSON.stringify(readCard, null, 4)) {
    throw Error("Does Not Match");
}

let v3CSV = createCSV(myPerson);
let vcard3Path = "./test/vcard3.vcf";
let vcard3CSVPath = "./test/vcard3.csv";

writeFile(vcard3Path, v3Card, () => {
    console.log('vCard written to ' + vcard3Path)
});

writeFile(vcard3CSVPath, v3CSV, () => {
    console.log('vCard written to ' + vcard3Path)
});

function execSync(arg0: string) {
    throw new Error("Function not implemented.");
}
