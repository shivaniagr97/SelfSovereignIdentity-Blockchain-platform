'use strict';

class Identity {
    /**
     *
     * @param holderID
     * @param documentID
     * @param documentType
     * @param document
     * @returns {Identity}
     */
    constructor(holderID, documentID, documentType, document) {
        this.holderID = holderID;
        this.documentID = documentID;
        this.documentType = documentType;
        this.document = document;
        if (this.__isContract) {
            delete this.__isContract;
        }
        return this;
    }
}

/**
 *
 * @type {Identity}
 */
module.exports = Identity;

