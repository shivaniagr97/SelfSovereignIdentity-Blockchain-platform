'use strict';

class Verifier {
    /**
     *
     * @param verifierID
     * @param password
     * @param contact
     * @param email
     * @returns {Verifier}
     */
    constructor(verifierID, password, contact, email) {
        if (this.validateVerifier(verifierID)) {
            this.verifierID = verifierID;
            this.password = password;
            this.contact = contact;
            this.email = email;
            this.type = 'verifier';
            if (this.__isContract) {
                delete this.__isContract;
            }
            if (this.name) {
                delete this.name;
            }
            return this;
        } else {
            throw new Error('the verifierID is not valid.');
        }
    }

    async validateVerifier(verifierID) {
        return !!verifierID;
    }
}

/**
 *
 * @type {Verifier}
 */
module.exports = Verifier;

