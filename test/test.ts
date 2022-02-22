import * as vcard4 from "vcard4";
import vcard3 from "vcard-creator";

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
import { Person } from "../src/types/schema"

let myPerson: Person = {
    "@type": "Person",
    familyName: "Perrault",
    givenName: "Simon",
    honorificPrefix: "Dr.",
    honorificSuffix: "ing. jr, M.Sc.",
    additionalName: "J",
    
};

console.log(myPerson);


const createV4 = (person: Person): string => {

    //FN property
    const fn = new FNProperty([], new TextType(`${person.honorificPrefix} ${person.additionalName} ${person.givenName} ${person.familyName} ${person.honorificSuffix}`));

    //N property
    const nArr = new Array(5);
    nArr[0] = new TextType("Perreault");
    nArr[1] = new TextType("Simon");
    nArr[2] = new TextType("J");
    nArr[3] = new TextType("Dr.");
    nArr[4] = new TextListType([new TextType("ing. jr"), new TextType("M.Sc.")]);
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

const createV3 = (person: Person) => {
    //@ts-ignore
    let vc = new vcard3.default();
    return vc
        .addName(
            person.familyName,
            person.givenName,
            person.additionalName,
            person.honorificPrefix,
            person.honorificSuffix)
        .addCompany('Siesqo')
        .addJobtitle('Web Developer')
        .addRole('Data Protection Officer')
        .addEmail('info@jeroendesloovere.be')
        .addPhoneNumber(1234121212, 'PREF;WORK')
        .addPhoneNumber(123456789, 'WORK')
        .addAddress(null, null, 'street', 'worktown', null, 'workpostcode', 'Belgium')
        .addURL('http://www.jeroendesloovere.be').toString()

}

let v3Card = createV3(myPerson);
let v4Card = createV4(myPerson);

console.log(v3Card, v4Card);

let vcard3Path = "./test/vcard3.vcf";
let vcard4Path = "./test/vcard4.vcf";

writeFile(vcard3Path, v3Card, () => {
    console.log('vCard written to ' + vcard3Path)
});
writeFile(vcard4Path, v4Card, () => {
    console.log('vCard written to ' + vcard4Path)
});