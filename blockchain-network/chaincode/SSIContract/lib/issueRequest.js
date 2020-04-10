'use strict';

class IssueRequest {

    /**
     *
     * @param holderID
     * @param issuerID
     * @param documentType
     * @param timeStamp
     * @param requestId
     * @returns {IssueRequest}
     */
    constructor(holderID, issuerID, documentType, timeStamp,requestId) {
        this.holderID = holderID;
        this.issuerID = issuerID;
        this.documentType = documentType;
        this.timeStamp = timeStamp;
        this.requestID = requestId;
        this.type = 'issueRequest';
        if (this.__isContract) {
            delete this.__isContract;
        }
        return this;
    }
}

module.exports = IssueRequest;
