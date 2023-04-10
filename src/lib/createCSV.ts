import { PersonCryptoKey, CryptoKey } from "../class/class";
import { SLIP_0044_TYPE } from "../class/slip_0044";
import { PostalAddress, Organization, Occupation, ContactPoint } from "schema-dts";
import { createNote } from "./createNote";

export const createCSV = (person: PersonCryptoKey) => {

    let stripComma = (a: any | undefined): string => {
        if (a) {
            return a.replaceAll(",", "");
        } else {
            return "";
        }
    }
    let inputs = [
        person.givenName,
        person.additionalName,
        person.familyName,
        person.honorificPrefix,
        person.honorificSuffix
    ];
    let homeAddress: PostalAddress = { "@type": "PostalAddress" }, businessAddress: PostalAddress = { "@type": "PostalAddress" };

    let cPA = (person.contactPoint as Array<ContactPoint>);
    if (cPA?.length) {
        for (let cP = 0; cP < cPA.length; cP++) {
            if (cPA[cP]["@type"] === "PostalAddress") {
                if (cPA[cP].name === "home") {
                    homeAddress = cPA[cP] as PostalAddress;
                } else if (cPA[cP].name === "work") {
                    businessAddress = cPA[cP] as PostalAddress;
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
}