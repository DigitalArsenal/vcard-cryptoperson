import { UPMT } from "../class/UPM/UPM";
import { ContactPointT } from "../class/UPM/ContactPoint"
import { SLIP_0044_TYPE } from "../class/slip_0044";
import { CryptoKeyT } from "../class/UPM/CryptoKey";

export const createCSV = (person: UPMT, note?: string) => {
    throw Error("NOT IMPLEMENTED");

    let stripComma = (a: any | undefined): string => {
        if (a) {
            return a.replaceAll(",", "");
        } else {
            return "";
        }
    }
    let inputs = [
        person.GIVEN_NAME,
        person.ADDITIONAL_NAME,
        person.FAMILY_NAME,
        person.HONORIFIC_PREFIX,
        person.HONORIFIC_SUFFIX
    ];

    const businessAddress: ContactPointT = person.CONTACT_POINT.find((c: ContactPointT) => c.ADDRESS_COUNTRY && c.CONTACT_TYPE === "work") || new ContactPointT();
    const homeAddress: ContactPointT = person.CONTACT_POINT.find((c: ContactPointT) => c.ADDRESS_COUNTRY && c.CONTACT_TYPE === "home") || new ContactPointT();

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
        "IMAddress": person.KEY.map((k: CryptoKeyT) => k.PUBLIC_KEY).join(", "),
        "Job Title": "",
        "Department": "",
        "Company": "",
        "Office Location": "",
        "Manager's Name": "",
        "Assistant's Name": "",
        "Assistant's Phone": "",
        "Company Yomi": "",
        "Business Street": `${businessAddress.POST_OFFICE_BOX_NUMBER ? businessAddress.POST_OFFICE_BOX_NUMBER + " " : ""}${businessAddress.STREET_ADDRESS}`,
        "Business City": businessAddress.ADDRESS_LOCALITY,
        "Business State": businessAddress.ADDRESS_REGION,
        "Business Postal Code": businessAddress.ADDRESS_COUNTRY,
        "Business Country/Region": businessAddress.ADDRESS_COUNTRY,
        "Home Street": `${homeAddress.POST_OFFICE_BOX_NUMBER ? homeAddress.POST_OFFICE_BOX_NUMBER + " " : ""}${homeAddress.STREET_ADDRESS}`,
        "Home City": homeAddress.ADDRESS_LOCALITY,
        "Home State": homeAddress.ADDRESS_REGION,
        "Home Postal Code": homeAddress.ADDRESS_COUNTRY,
        "Home Country/Region": homeAddress.ADDRESS_COUNTRY,
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
        "Notes": note,
    };
    //@ts-ignore
    return [Object.keys(headers), Object.values(headers)].join("\n");
}