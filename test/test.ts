

import { writeFile } from "fs";
import { PersonPublicKey } from "../src/class/class";
import { SLIP_0044_TYPE } from "../src/class/slip_0044";
import { createV3, readVCARD } from "../src/index";

let myPerson: PersonPublicKey = {
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
        postOfficeBoxNumber: "Suite D1-630",
        streetAddress: "1111 Work Street",
        addressLocality: "Quebec",
        addressRegion: "QC",
        addressCountry: "Canada",
        postalCode: "G1V 2M2"
    },
    contactPoint: [
        {
            "@type": "PostalAddress",
            "name": "home",
            postOfficeBoxNumber: "Suite D2-630",
            streetAddress: "2875 Laurier",
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

console.log(readVCARD(v3Card))
let vcard3Path = "./test/vcard3.vcf";

writeFile(vcard3Path, v3Card, () => {
    console.log('vCard written to ' + vcard3Path)
});