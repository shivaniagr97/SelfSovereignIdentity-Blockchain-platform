'use strict';

class IssueRequest {

    /**
     *
     * @param holderID
     * @param issuerID
     * @param documentType
     * @param timeStamp
     * @returns {IssueRequest}
     */
    constructor(holderID, issuerID, documentType, timeStamp) {
        this.holderID = holderID;
        this.issuerID = issuerID;
        this.documentType = documentType;
        this.timeStamp = timeStamp;
        this.requestID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        this.type = 'issueRequest';
        if (this.__isContract) {
            delete this.__isContract;
        }
        return this;
    }
}

module.exports = IssueRequest;
