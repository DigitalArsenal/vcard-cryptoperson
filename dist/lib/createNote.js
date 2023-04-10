export const createNote = (person) => {
    return `-----START KEYMASTER-----${btoa(JSON.stringify(person))}-----END KEYMASTER-----`;
};
