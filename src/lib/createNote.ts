import { PersonCryptoKey, CryptoKey } from "../class/class";

export const createNote = (person: PersonCryptoKey) => {
    return `-----START KEYMASTER-----${btoa(JSON.stringify(person))}-----END KEYMASTER-----`
}
