import * as vcard4 from "vcard4";
import atob from "atob";
import btoa from "btoa";

let {
    TextType,
    TextListType,
    DateTimeType,
    IntegerType,
    LanguageTagType,
    URIType,
    SexType,
    SpecialValueType,
    ValueParameter,
    PrefParameter,
    TypeParameter,
    FNProperty,
    NProperty,
    BdayProperty,
    AnniversaryProperty,
    GenderProperty,
    AdrProperty,
    TelProperty,
    EmailProperty,
    LangProperty,
    TzProperty,
    GeoProperty,
    OrgProperty,
    URLProperty,
    KeyProperty,
    VCARD,
} = vcard4;

import { writeFile } from "fs";
import { PersonPublicKey, cryptoKey } from "../src/class/class";
import { SLIP_0044_TYPE } from "../src/class/slip_0044";
import { PostalAddress, Organization, Occupation } from "digital-arsenal-schema-dts";

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

console.log(myPerson);

const createV4 = (person: PersonPublicKey): string => {
    throw Error("Not Implemented");
    let { familyName,
        givenName,
        honorificPrefix,
        honorificSuffix,
        additionalName,
        address
    } = person;
    //FN property
    const fn = new FNProperty([], new TextType(`${honorificPrefix} ${givenName} ${additionalName} ${familyName}`));

    //N property
    const nArr = new Array(5);
    nArr[0] = new TextType(familyName as string);
    nArr[1] = new TextType(givenName as string);
    nArr[2] = new TextType(additionalName as string);
    nArr[3] = new TextType(honorificPrefix as string);
    nArr[4] = new TextListType((honorificSuffix as string).split(",").map(v => { return new TextType(v) }));

    const n = new NProperty([], new SpecialValueType(nArr, "nproperty"));

    // BDAY property
    const bday = new BdayProperty([], new DateTimeType("--0203", "dateandortime"));

    // ANNIVERSARY property
    const anniversary = new AnniversaryProperty(
        [],
        new DateTimeType("20090808T1430-0500", "dateandortime")
    );

    // GENDER property
    const gender = new GenderProperty([], new SexType("M"));

    // LANG properties
    const lang1 = new LangProperty(
        [new PrefParameter(new IntegerType(1))],
        new LanguageTagType("fr")
    );
    const lang2 = new LangProperty(
        [new PrefParameter(new IntegerType(2))],
        new LanguageTagType("en")
    );

    // ORG property
    const org = new OrgProperty(
        [new TypeParameter(new TextType("work"), "orgproperty")],
        new SpecialValueType([new TextType("Viagenie")], "orgproperty")
    );

    // ADR property
    const aArr = new Array(7);
    aArr[1] = new TextType("Suite D2-630");
    aArr[2] = new TextType("2875 Laurier");
    aArr[3] = new TextType("Quebec");
    aArr[4] = new TextType("QC");
    aArr[5] = new TextType("G1V 2M2");
    aArr[6] = new TextType("Canada");
    const adr = new AdrProperty(
        [new TypeParameter(new TextType("work"), "adrproperty")],
        new SpecialValueType(aArr, "adrproperty")
    );

    // TEL properties
    const tel1 = new TelProperty(
        [
            new ValueParameter(new URIType("tel:+1-418-656-9254;ext=102")),
            new TypeParameter(
                new TextListType([new TextType("work"), new TextType("voice")]),
                "telproperty"
            ),
            new PrefParameter(new IntegerType(1)),
        ],
        new URIType("tel:+1-418-656-9254;ext=102")
    );

    const tel2 = new TelProperty(
        [
            new ValueParameter(new URIType("tel:+1-418-262-6501")),
            new TypeParameter(
                new TextListType([
                    new TextType("work"),
                    new TextType("cell"),
                    new TextType("voice"),
                    new TextType("video"),
                    new TextType("text"),
                ]),
                "telproperty"
            ),
        ],
        new URIType("tel:+1-418-262-6501")
    );

    // EMAIL property
    const email = new EmailProperty(
        [new TypeParameter(new TextType("work"), "emailproperty")],
        new TextType("simon.perreault@viagenie.ca")
    );

    // GEO property
    const geo = new GeoProperty(
        [new TypeParameter(new TextType("work"), "geoproperty")],
        new URIType("geo:46.772673,-71.282945")
    );

    // KEY property
    const key = new KeyProperty(
        [new TypeParameter(new TextType("work"), "keyproperty")],
        new URIType("http://www.viagenie.ca/simon.perreault/simon.asc")
    );

    // TZ property
    const tz = new TzProperty([], new DateTimeType("-0500", "utcoffset"));

    // URL property
    const url = new URLProperty(
        [new TypeParameter(new TextType("home"), "urlproperty")],
        new URIType("http://nomis80.org")
    );

    // assembling all the properties into a vCard
    return new VCARD([
        fn,
        n,
        bday,
        anniversary,
        gender,
        lang1,
        lang2,
        org,
        adr,
        tel1,
        tel2,
        email,
        geo,
        key,
        tz,
        url,
    ]).repr();
}

const createAddress = (address: PostalAddress, prefix: string = "ADR") => `${prefix};type=${address.name || "work"};type=pref:;${address.postOfficeBoxNumber};${address.streetAddress};${address.addressLocality};${address.addressRegion};${address.postalCode};${address.addressCountry}\n`;

const createV3 = (person: PersonPublicKey, format: string = "vcalendar", appendJSON: boolean = true) => {
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

let v3Card = createV3(myPerson);

console.log(v3Card);

let vcard3Path = "./test/vcard3.vcf";

writeFile(vcard3Path, v3Card, () => {
    console.log('vCard written to ' + vcard3Path)
});