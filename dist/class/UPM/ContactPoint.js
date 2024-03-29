// automatically generated by the FlatBuffers compiler, do not modify
import * as flatbuffers from 'flatbuffers';
export class ContactPoint {
    bb = null;
    bb_pos = 0;
    __init(i, bb) {
        this.bb_pos = i;
        this.bb = bb;
        return this;
    }
    static getRootAsContactPoint(bb, obj) {
        return (obj || new ContactPoint()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
    }
    static getSizePrefixedRootAsContactPoint(bb, obj) {
        bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
        return (obj || new ContactPoint()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
    }
    NAME(optionalEncoding) {
        const offset = this.bb.__offset(this.bb_pos, 4);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    }
    CONTACT_TYPE(optionalEncoding) {
        const offset = this.bb.__offset(this.bb_pos, 6);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    }
    EMAIL(optionalEncoding) {
        const offset = this.bb.__offset(this.bb_pos, 8);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    }
    TELEPHONE(optionalEncoding) {
        const offset = this.bb.__offset(this.bb_pos, 10);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    }
    CONTACT_OPTION(optionalEncoding) {
        const offset = this.bb.__offset(this.bb_pos, 12);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    }
    AREA_SERVED(optionalEncoding) {
        const offset = this.bb.__offset(this.bb_pos, 14);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    }
    AVAILABLE_LANGUAGE(optionalEncoding) {
        const offset = this.bb.__offset(this.bb_pos, 16);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    }
    ADDRESS_COUNTRY(optionalEncoding) {
        const offset = this.bb.__offset(this.bb_pos, 18);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    }
    ADDRESS_REGION(optionalEncoding) {
        const offset = this.bb.__offset(this.bb_pos, 20);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    }
    ADDRESS_LOCALITY(optionalEncoding) {
        const offset = this.bb.__offset(this.bb_pos, 22);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    }
    POSTAL_CODE(optionalEncoding) {
        const offset = this.bb.__offset(this.bb_pos, 24);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    }
    STREET_ADDRESS(optionalEncoding) {
        const offset = this.bb.__offset(this.bb_pos, 26);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    }
    POST_OFFICE_BOX_NUMBER(optionalEncoding) {
        const offset = this.bb.__offset(this.bb_pos, 28);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    }
    static startContactPoint(builder) {
        builder.startObject(13);
    }
    static addName(builder, NAMEOffset) {
        builder.addFieldOffset(0, NAMEOffset, 0);
    }
    static addContactType(builder, CONTACT_TYPEOffset) {
        builder.addFieldOffset(1, CONTACT_TYPEOffset, 0);
    }
    static addEmail(builder, EMAILOffset) {
        builder.addFieldOffset(2, EMAILOffset, 0);
    }
    static addTelephone(builder, TELEPHONEOffset) {
        builder.addFieldOffset(3, TELEPHONEOffset, 0);
    }
    static addContactOption(builder, CONTACT_OPTIONOffset) {
        builder.addFieldOffset(4, CONTACT_OPTIONOffset, 0);
    }
    static addAreaServed(builder, AREA_SERVEDOffset) {
        builder.addFieldOffset(5, AREA_SERVEDOffset, 0);
    }
    static addAvailableLanguage(builder, AVAILABLE_LANGUAGEOffset) {
        builder.addFieldOffset(6, AVAILABLE_LANGUAGEOffset, 0);
    }
    static addAddressCountry(builder, ADDRESS_COUNTRYOffset) {
        builder.addFieldOffset(7, ADDRESS_COUNTRYOffset, 0);
    }
    static addAddressRegion(builder, ADDRESS_REGIONOffset) {
        builder.addFieldOffset(8, ADDRESS_REGIONOffset, 0);
    }
    static addAddressLocality(builder, ADDRESS_LOCALITYOffset) {
        builder.addFieldOffset(9, ADDRESS_LOCALITYOffset, 0);
    }
    static addPostalCode(builder, POSTAL_CODEOffset) {
        builder.addFieldOffset(10, POSTAL_CODEOffset, 0);
    }
    static addStreetAddress(builder, STREET_ADDRESSOffset) {
        builder.addFieldOffset(11, STREET_ADDRESSOffset, 0);
    }
    static addPostOfficeBoxNumber(builder, POST_OFFICE_BOX_NUMBEROffset) {
        builder.addFieldOffset(12, POST_OFFICE_BOX_NUMBEROffset, 0);
    }
    static endContactPoint(builder) {
        const offset = builder.endObject();
        return offset;
    }
    static createContactPoint(builder, NAMEOffset, CONTACT_TYPEOffset, EMAILOffset, TELEPHONEOffset, CONTACT_OPTIONOffset, AREA_SERVEDOffset, AVAILABLE_LANGUAGEOffset, ADDRESS_COUNTRYOffset, ADDRESS_REGIONOffset, ADDRESS_LOCALITYOffset, POSTAL_CODEOffset, STREET_ADDRESSOffset, POST_OFFICE_BOX_NUMBEROffset) {
        ContactPoint.startContactPoint(builder);
        ContactPoint.addName(builder, NAMEOffset);
        ContactPoint.addContactType(builder, CONTACT_TYPEOffset);
        ContactPoint.addEmail(builder, EMAILOffset);
        ContactPoint.addTelephone(builder, TELEPHONEOffset);
        ContactPoint.addContactOption(builder, CONTACT_OPTIONOffset);
        ContactPoint.addAreaServed(builder, AREA_SERVEDOffset);
        ContactPoint.addAvailableLanguage(builder, AVAILABLE_LANGUAGEOffset);
        ContactPoint.addAddressCountry(builder, ADDRESS_COUNTRYOffset);
        ContactPoint.addAddressRegion(builder, ADDRESS_REGIONOffset);
        ContactPoint.addAddressLocality(builder, ADDRESS_LOCALITYOffset);
        ContactPoint.addPostalCode(builder, POSTAL_CODEOffset);
        ContactPoint.addStreetAddress(builder, STREET_ADDRESSOffset);
        ContactPoint.addPostOfficeBoxNumber(builder, POST_OFFICE_BOX_NUMBEROffset);
        return ContactPoint.endContactPoint(builder);
    }
    unpack() {
        return new ContactPointT(this.NAME(), this.CONTACT_TYPE(), this.EMAIL(), this.TELEPHONE(), this.CONTACT_OPTION(), this.AREA_SERVED(), this.AVAILABLE_LANGUAGE(), this.ADDRESS_COUNTRY(), this.ADDRESS_REGION(), this.ADDRESS_LOCALITY(), this.POSTAL_CODE(), this.STREET_ADDRESS(), this.POST_OFFICE_BOX_NUMBER());
    }
    unpackTo(_o) {
        _o.NAME = this.NAME();
        _o.CONTACT_TYPE = this.CONTACT_TYPE();
        _o.EMAIL = this.EMAIL();
        _o.TELEPHONE = this.TELEPHONE();
        _o.CONTACT_OPTION = this.CONTACT_OPTION();
        _o.AREA_SERVED = this.AREA_SERVED();
        _o.AVAILABLE_LANGUAGE = this.AVAILABLE_LANGUAGE();
        _o.ADDRESS_COUNTRY = this.ADDRESS_COUNTRY();
        _o.ADDRESS_REGION = this.ADDRESS_REGION();
        _o.ADDRESS_LOCALITY = this.ADDRESS_LOCALITY();
        _o.POSTAL_CODE = this.POSTAL_CODE();
        _o.STREET_ADDRESS = this.STREET_ADDRESS();
        _o.POST_OFFICE_BOX_NUMBER = this.POST_OFFICE_BOX_NUMBER();
    }
}
export class ContactPointT {
    NAME;
    CONTACT_TYPE;
    EMAIL;
    TELEPHONE;
    CONTACT_OPTION;
    AREA_SERVED;
    AVAILABLE_LANGUAGE;
    ADDRESS_COUNTRY;
    ADDRESS_REGION;
    ADDRESS_LOCALITY;
    POSTAL_CODE;
    STREET_ADDRESS;
    POST_OFFICE_BOX_NUMBER;
    constructor(NAME = null, CONTACT_TYPE = null, EMAIL = null, TELEPHONE = null, CONTACT_OPTION = null, AREA_SERVED = null, AVAILABLE_LANGUAGE = null, ADDRESS_COUNTRY = null, ADDRESS_REGION = null, ADDRESS_LOCALITY = null, POSTAL_CODE = null, STREET_ADDRESS = null, POST_OFFICE_BOX_NUMBER = null) {
        this.NAME = NAME;
        this.CONTACT_TYPE = CONTACT_TYPE;
        this.EMAIL = EMAIL;
        this.TELEPHONE = TELEPHONE;
        this.CONTACT_OPTION = CONTACT_OPTION;
        this.AREA_SERVED = AREA_SERVED;
        this.AVAILABLE_LANGUAGE = AVAILABLE_LANGUAGE;
        this.ADDRESS_COUNTRY = ADDRESS_COUNTRY;
        this.ADDRESS_REGION = ADDRESS_REGION;
        this.ADDRESS_LOCALITY = ADDRESS_LOCALITY;
        this.POSTAL_CODE = POSTAL_CODE;
        this.STREET_ADDRESS = STREET_ADDRESS;
        this.POST_OFFICE_BOX_NUMBER = POST_OFFICE_BOX_NUMBER;
    }
    pack(builder) {
        const NAME = (this.NAME !== null ? builder.createString(this.NAME) : 0);
        const CONTACT_TYPE = (this.CONTACT_TYPE !== null ? builder.createString(this.CONTACT_TYPE) : 0);
        const EMAIL = (this.EMAIL !== null ? builder.createString(this.EMAIL) : 0);
        const TELEPHONE = (this.TELEPHONE !== null ? builder.createString(this.TELEPHONE) : 0);
        const CONTACT_OPTION = (this.CONTACT_OPTION !== null ? builder.createString(this.CONTACT_OPTION) : 0);
        const AREA_SERVED = (this.AREA_SERVED !== null ? builder.createString(this.AREA_SERVED) : 0);
        const AVAILABLE_LANGUAGE = (this.AVAILABLE_LANGUAGE !== null ? builder.createString(this.AVAILABLE_LANGUAGE) : 0);
        const ADDRESS_COUNTRY = (this.ADDRESS_COUNTRY !== null ? builder.createString(this.ADDRESS_COUNTRY) : 0);
        const ADDRESS_REGION = (this.ADDRESS_REGION !== null ? builder.createString(this.ADDRESS_REGION) : 0);
        const ADDRESS_LOCALITY = (this.ADDRESS_LOCALITY !== null ? builder.createString(this.ADDRESS_LOCALITY) : 0);
        const POSTAL_CODE = (this.POSTAL_CODE !== null ? builder.createString(this.POSTAL_CODE) : 0);
        const STREET_ADDRESS = (this.STREET_ADDRESS !== null ? builder.createString(this.STREET_ADDRESS) : 0);
        const POST_OFFICE_BOX_NUMBER = (this.POST_OFFICE_BOX_NUMBER !== null ? builder.createString(this.POST_OFFICE_BOX_NUMBER) : 0);
        return ContactPoint.createContactPoint(builder, NAME, CONTACT_TYPE, EMAIL, TELEPHONE, CONTACT_OPTION, AREA_SERVED, AVAILABLE_LANGUAGE, ADDRESS_COUNTRY, ADDRESS_REGION, ADDRESS_LOCALITY, POSTAL_CODE, STREET_ADDRESS, POST_OFFICE_BOX_NUMBER);
    }
}
