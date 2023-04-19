

import { writeFile, writeFileSync } from "fs";
import { PersonCryptoKey } from "../src/class/class";
import { createV3, readVCARD } from "../src/index";
import { UPMT } from "../src/class/UPM/UPM";
import { OccupationT } from "../src/class/UPM/Occupation";
import { ContactPointT } from "../src/class/UPM/ContactPoint";
import { OrganizationT } from "../src/class/UPM/Organization";
import { CryptoKeyT } from "../src/class/UPM/CryptoKey";

let myPerson: UPMT = new UPMT();

myPerson.FAMILY_NAME = "Perrault";
myPerson.GIVEN_NAME = "Simon";
myPerson.ADDITIONAL_NAME = "J";
myPerson.HONORIFIC_PREFIX = "Dr.";
myPerson.HONORIFIC_SUFFIX = "ing. jr, M.Sc.";

let cryptoKey1: CryptoKeyT = new CryptoKeyT();
cryptoKey1.PUBLIC_KEY = "03E9873D79C6D87DC0FB6A5778633389F4453213303DA61F20BD67FC233AA33262";
cryptoKey1.KEY_ADDRESS = "bc1qyzxdu4px4jy8gwhcj82zpv7qzhvc0fvumgnh0r";
cryptoKey1.ADDRESS_TYPE = 0;

let cryptoKey2: CryptoKeyT = new CryptoKeyT();
cryptoKey2.PUBLIC_KEY = "03b7b4d57a2adb4adda5e7b43132546f7ea3bbc8457e85913efbc44c8bd0eafd9d";
cryptoKey2.KEY_ADDRESS = "bc1q54xap0rtaxa7aehh9flnav2e4gqdfyeru38zep";
cryptoKey2.ADDRESS_TYPE = 0;

myPerson.KEY = [];
myPerson.KEY.push(cryptoKey1);
myPerson.KEY.push(cryptoKey2);

let occupation: OccupationT = new OccupationT();
occupation.NAME = "Scientist";
myPerson.HAS_OCCUPATION = occupation;

let organization: OrganizationT = new OrganizationT();
organization.NAME = "Canada Pharma., Inc";
organization.LEGAL_NAME = "Canada Pharma., Inc";
myPerson.AFFILIATION = organization;

let postalAddress: ContactPointT = new ContactPointT();
postalAddress.ADDRESS_COUNTRY = "Canada";
postalAddress.ADDRESS_REGION = "QC";
postalAddress.ADDRESS_LOCALITY = "Quebec";
postalAddress.POSTAL_CODE = "G1V 2M2";
postalAddress.STREET_ADDRESS = "2875 Laurier, Suite D2-630";
postalAddress.POST_OFFICE_BOX_NUMBER = "";

let contactPoint1: ContactPointT = new ContactPointT();
contactPoint1.CONTACT_TYPE = "home";
contactPoint1.TELEPHONE = "(864) 986-0602";

let contactPoint2: ContactPointT = new ContactPointT();
contactPoint2.CONTACT_TYPE = "work";
contactPoint2.EMAIL = "home@email.com";

myPerson.CONTACT_POINT = [];
myPerson.CONTACT_POINT.push(postalAddress);
myPerson.CONTACT_POINT.push(contactPoint1);
myPerson.CONTACT_POINT.push(contactPoint2);

let v3Card = createV3(myPerson);
let vcard3Path = "./test/vcard3.vcf";

writeFileSync(vcard3Path, v3Card);
let readCard = readVCARD(v3Card);

writeFileSync("./test/test1.json", JSON.stringify(myPerson, null, 4));
writeFileSync("./test/test2.json", JSON.stringify(readCard, null, 4))





if (JSON.stringify(myPerson) !== JSON.stringify(readCard)) {
    throw Error("Does Not Match");
}/**/