'use strict';

class VerifyRequest {

    /**
     *
     * @param holderID
     * @param verifierID
     * @param documentID
     * @param timeStamp
     * @returns {IssueRequest}
     */
    constructor(holderID, verifierID, documentID, timeStamp) {
        this.holderID = holderID;
        this.verifierID = verifierID;
        this.documentID = documentID;
        this.timeStamp = timeStamp;
        this.requestID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        this.type = 'verifyRequest';
        if (this.__isContract) {
            delete this.__isContract;
        }
        return this;
    }
}

module.exports = VerifyRequest;
