'use strict';

class Holder {
    /**
     * @param firstName
     * @param lastName
     * @param userID
     * @param password
     * @param dateOfBirth
     * @param address
     * @param city
     * @param state
     * @param pinCode
     * @param contact
     * @param email
     * @returns {Holder}
     */
    constructor(firstName, lastName, userID, password, dateOfBirth, address, city, state, pinCode, contact, email) {
        if (this.validateUser(userID)) {
            this.firstName = firstName;
            this.lastName = lastName;
            this.userID = userID;
            this.password = password;
            this.dateOfBirth = dateOfBirth;
            this.address = address;
            this.city = city;
            this.state = state;
            this.pinCode = pinCode;
            this.contact = contact;
            this.email = email;
            this.type = 'holder';
            if (this.__isContract) {
                delete this.__isContract;
            }
            if (this.name) {
                delete this.name;
            }
            return this;
        } else {
            throw new Error('the userID is not valid.');
        }
    }

    async validateUser(userID) {
        return !!userID;
    }
}

/**
 * @type {Holder}
 */
module.exports = Holder;
