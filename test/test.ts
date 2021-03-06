

import { writeFile } from "fs";
import { PersonCryptoKey } from "../src/class/class";
import { SLIP_0044_TYPE } from "../src/class/slip_0044";
import { createV3, readVCARD, createCSV } from "../src/index";

let myPerson: PersonCryptoKey = {
    "@type": "Person",
    key: [
        {
            "@type": "CryptoKey",
            publicKey: "03b8b4d57a2adb4adda5e7b43132546f7ea3bbc8457e85913efbc44c8bd0eafd9d",
            keyAddress: "bc1q54xdp0rtaxa7aehh9flnav2e4gqdfyeru38zep",
            keyType: SLIP_0044_TYPE.BTC
        },
        {
            "@type": "CryptoKey",
            publicKey: "03b7b4d57a2adb4adda5e7b43132546f7ea3bbc8457e85913efbc44c8bd0eafd9d",
            keyAddress: "bc1q54xap0rtaxa7aehh9flnav2e4gqdfyeru38zep",
            keyType: SLIP_0044_TYPE.BTC
        }
    ],

    familyName: "Perrault",
    givenName: "Simon",
    honorificPrefix: "Dr.",
    honorificSuffix: "ing. jr, M.Sc.",
    additionalName: "J",
    hasOccupation: {
        "@type": "Occupation",
        "name": "Scientist"
    },
    affiliation: {
        "@type": "Organization",
        "legalName": "Canada Pharma., Inc",
        "name": "Canada Pharma., Inc"
    },
    address: {
        "@type": "PostalAddress",
        "name": "work",
        postOfficeBoxNumber: "",
        streetAddress: "1111 Work Street, Suite D1-630",
        addressLocality: "Quebec",
        addressRegion: "QC",
        addressCountry: "Canada",
        postalCode: "G1V 2M2"
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
        },
    ]
};

let v3Card = createV3(myPerson);
let readCard = readVCARD(v3Card);

console.log(readCard);

let v3CSV = createCSV(myPerson);
let vcard3Path = "./test/vcard3.vcf";
let vcard3CSVPath = "./test/vcard3.csv";

writeFile(vcard3Path, v3Card, () => {
    console.log('vCard written to ' + vcard3Path)
});

writeFile(vcard3CSVPath, v3CSV, () => {
    console.log('vCard written to ' + vcard3Path)
});