'use strict';

class Issuer {
    /**
     *
     * @param issuerID
     * @param password
     * @param issuerType
     * @param city
     * @param state
     * @param pinCode
     * @param contact
     * @param email
     * @returns {Issuer}
     */
    constructor(issuerID, password, issuerType, city, state, pinCode, contact, email) {
        if (this.validateIssuer(issuerID)) {
            this.issuerID = issuerID;
            this.password = password;
            this.issuerType = issuerType;
            this.city = city;
            this.state = state;
            this.pinCode = pinCode;
            this.contact = contact;
            this.email = email;
            this.type = 'issuer';
            if (this.__isContract) {
                delete this.__isContract;
            }
            if (this.name) {
                delete this.name;
            }
            return this;
        } else {
            throw new Error('the issuerID is not valid.');
        }
    }

    async validateIssuer(issuerID) {
        return !!issuerID;
    }
}

/**
 *
 * @type {Issuer}
 */
module.exports = Issuer;

