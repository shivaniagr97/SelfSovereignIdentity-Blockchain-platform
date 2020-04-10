'use strict';

class VerifyRequest {

    /**
     *
     * @param holderID
     * @param verifierID
     * @param documentID
     * @param timeStamp
     * @param requestId
     * @returns {IssueRequest}
     */
    constructor(holderID, verifierID, documentID, timeStamp, requestId) {
        this.holderID = holderID;
        this.verifierID = verifierID;
        this.documentID = documentID;
        this.timeStamp = timeStamp;
        this.requestID = requestId;
        this.type = 'verifyRequest';
        if (this.__isContract) {
            delete this.__isContract;
        }
        return this;
    }
}

module.exports = VerifyRequest;
