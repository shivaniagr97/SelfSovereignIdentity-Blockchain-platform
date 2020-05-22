/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const {Contract} = require('fabric-contract-api');
const path = require('path');
const fs = require('fs');

let Holder = require('./holder.js');
let Verifier = require('./verifier.js');
let Issuer = require('./issuer.js');
let Identity = require('./identity.js');
let IssueRequest = require('./issueRequest.js');
let VerifyRequest = require('./verifyRequest.js');

/**
 * @author : Shivani Agrawal
 * @Date : 09/02/2020
 */

class SsiSmartContractContract extends Contract {

    /**
     *
     * @param ctx
     * @returns {Promise<void>}
     */
    async initLedger(ctx) {
        console.log('============= START : Initialize Ledger ===========');

        //create a user
        let holder1 = {};
        holder1.firstName = 'shivani';
        holder1.lastName = 'agrawal';
        holder1.userID = 'ashivani997';
        holder1.password = '12345';
        holder1.dateOfBirth = '09/07/1997';
        holder1.address = 'B318, new LH, NITW';
        holder1.city = 'warangal';
        holder1.state = 'telangana';
        holder1.pinCode = '506004';
        holder1.contact = '9406474464';
        holder1.email = 'ashivani997@gmail.com';

        let response = await this.createHolder(ctx, JSON.stringify(holder1));
        console.log(response);

        //create issuer
        let issuer1 = {};
        issuer1.issuerID = 'issuer1';
        issuer1.password = 'pass1';
        issuer1.issuerType = 'passport';
        issuer1.city = 'warangal';
        issuer1.state = 'telangana';
        issuer1.pinCode = '506004';
        issuer1.contact = '1234567890';
        issuer1.email = 'issuer1@gov.in';

        response = await this.createIssuer(ctx, JSON.stringify(issuer1));
        console.log(response);

        //create verifier
        let verifier1 = {};
        verifier1.verifierID = 'verifier1';
        verifier1.password = 'pass1';
        verifier1.contact = '9089786751';
        verifier1.email = 'verfier1@gmail.com';
        verifier1.docTypes = ['aadhaar'];

        response = await this.createVerifier(ctx, JSON.stringify(verifier1));
        console.log(response);

        //create identity
        let identity1 = {};
        identity1.holderID = 'ashivani997';
        identity1.documentID = 'id1';
        identity1.documentType = 'passport';
        identity1.document = 'hashed document';

        // response = await this.createIdentity(ctx, JSON.stringify(identity1));
        // console.log(response);

        console.log('============= END : Initialize Ledger ===========');
    }

    /**
     *
     * @param ctx
     * @param ssiSmartContractId
     * @returns {Promise<boolean|boolean>}
     */
    async ssiSmartContractExists(ctx, ssiSmartContractId) {
        const buffer = await ctx.stub.getState(ssiSmartContractId);
        return (!!buffer && buffer.length > 0);
    }

    /**
     *
     * @param ctx
     * @param ssiSmartContractId
     * @param value
     * @returns {Promise<void>}
     */
    async createSsiSmartContract(ctx, ssiSmartContractId, value) {
        const exists = await this.ssiSmartContractExists(ctx, ssiSmartContractId);
        if (exists) {
            throw new Error(`The ssi smart contract ${ssiSmartContractId} already exists`);
        }
        const asset = {value};
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(ssiSmartContractId, buffer);
    }

    /**
     *
     * @param ctx
     * @param ssiSmartContractId
     * @returns {Promise<any>}
     */
    async readSsiSmartContract(ctx, ssiSmartContractId) {
        const exists = await this.ssiSmartContractExists(ctx, ssiSmartContractId);
        if (!exists) {
            throw new Error(`The ssi smart contract ${ssiSmartContractId} does not exist`);
        }
        const buffer = await ctx.stub.getState(ssiSmartContractId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    /**
     *
     * @param ctx
     * @param ssiSmartContractId
     * @param newValue
     * @returns {Promise<void>}
     */
    async updateSsiSmartContract(ctx, ssiSmartContractId, newValue) {
        const exists = await this.ssiSmartContractExists(ctx, ssiSmartContractId);
        if (!exists) {
            throw new Error(`The ssi smart contract ${ssiSmartContractId} does not exist`);
        }
        const asset = {value: newValue};
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(ssiSmartContractId, buffer);
    }

    /**
     *
     * @param ctx
     * @param ssiSmartContractId
     * @returns {Promise<void>}
     */
    async deleteSsiSmartContract(ctx, ssiSmartContractId) {
        const exists = await this.ssiSmartContractExists(ctx, ssiSmartContractId);
        if (!exists) {
            throw new Error(`The ssi smart contract ${ssiSmartContractId} does not exist`);
        }
        await ctx.stub.deleteState(ssiSmartContractId);
    }

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<string>}
     */
    async createHolder(ctx, args) {
        args = JSON.parse(args);
        let accessRights = {};
        let trustedContacts = [];
        let issueRequests = [];
        let verifyRequests = [];
        let requesters = {};

        let holder = await new Holder(args.firstName, args.lastName, args.userID, args.password, args.dateOfBirth,
            args.address, args.city, args.state, args.pinCode, args.contact, args.email);

        holder.accessRights = accessRights;
        holder.trustedContacts = trustedContacts;
        holder.issueRequests = issueRequests;
        holder.verifyRequests = verifyRequests;
        holder.requesters = requesters;

        await ctx.stub.putState(holder.userID, Buffer.from(JSON.stringify(holder)));

        let response = `User with username ${holder.userID} is updated in the world state`;
        return response;
    }

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<string>}
     */
    async createIssuer(ctx, args) {
        args = JSON.parse(args);

        let issueRequests = [];
        let issuer = await new Issuer(args.issuerID, args.password, args.issuerType, args.city, args.state,
            args.pinCode, args.contact, args.email);
        issuer.issueRequests = issueRequests;

        await ctx.stub.putState(issuer.issuerID, Buffer.from(JSON.stringify(issuer)));

        let response = `Issuer with issuer id ${issuer.issuerID} is updated in the world state`;
        return response;
    }

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<string>}
     */
    async createVerifier(ctx, args) {
        args = JSON.parse(args);

        let verifyRequests = [];

        let verifier = await new Verifier(args.verifierID, args.password, args.contact, args.email, args.docTypes);

        verifier.verifyRequests = verifyRequests;

        await ctx.stub.putState(verifier.verifierID, Buffer.from(JSON.stringify(verifier)));

        let response = `Verifier with verifier id ${verifier.verifierID} is updated in the world state`;
        return response;
    }

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<string>}
     */
    async createIdentity(ctx, args) {
        args = JSON.parse(args);

        let documentExists = await this.assetExists(ctx, args.documentID);
        let holderExists = await this.assetExists(ctx, args.holderID);

        if (documentExists) {
            throw new Error(`Document with document id ${args.documentID} already exists in the world state`);
        }

        if (!holderExists) {
            throw new Error(`Holder id ${args.holderID} is invalid`);
        }

        let identity = await new Identity(args.holderID, args.documentID, args.documentType, args.document);

        await ctx.stub.putState(identity.documentID, Buffer.from(JSON.stringify(identity)));

        //update identity in user's profile
        let holderAsBytes = await ctx.stub.getState(identity.holderID);
        let holder = JSON.parse(holderAsBytes);
        let accessRights = holder.accessRights;
        accessRights[identity.documentID] = [];
        holder.accessRights = accessRights;

        await ctx.stub.putState(holder.userID, Buffer.from(JSON.stringify(holder)));

        let response = `Identity with document id ${identity.documentID} is updated in the world state`;
        return response;
    }

    /**
     *
     * @param ctx
     * @param args
     * @param requestID
     * @returns {Promise<string>}
     */
    async issueIdentity(ctx, args) {
        args = JSON.parse(args);

        let documentExists = await this.assetExists(ctx, args.documentID);
        let holderExists = await this.assetExists(ctx, args.holderID);
        let issuerExists = await this.assetExists(ctx, args.issuerID);
        let issueRequestExists = await this.assetExists(ctx, args.requestID);

        if (documentExists) {
            throw new Error(`Document with document id ${args.documentID} already exists in the world state`);
        }

        if (!holderExists) {
            throw new Error(`Holder id ${args.holderID} is invalid`);
        }

        if (!args.issuerID || !issuerExists) {
            throw new Error(`Issuer id ${args.issuerID} is invalid`);
        }

        let issuerAsBytes = await ctx.stub.getState(args.issuerID);
        let issuer = JSON.parse(issuerAsBytes);
        let issueRequests = issuer.issueRequests;
        const index = issueRequests.indexOf(args.requestID);
        if (issuer.issuerType !== args.documentType || !issueRequestExists || index === -1) {
            throw new Error(`Issuer with issuer id ${args.issuerID} does not have access to issue this document`);
        }

        let identity = await new Identity(args.holderID, args.documentID, args.documentType, args.document);
        identity.issuerID = args.issuerID;

        await ctx.stub.putState(identity.documentID, Buffer.from(JSON.stringify(identity)));

        //update identity in user's profile
        let holderAsBytes = await ctx.stub.getState(identity.holderID);
        let holder = JSON.parse(holderAsBytes);
        let accessRights = holder.accessRights;
        accessRights[identity.documentID] = [];
        holder.accessRights = accessRights;

        await ctx.stub.putState(holder.userID, Buffer.from(JSON.stringify(holder)));

        //mark issueRequest as completed
        let issueRequestAsBytes = await ctx.stub.getState(args.requestID);
        let issueRequest = JSON.parse(issueRequestAsBytes);
        issueRequest.status = 'accepted';
        issueRequest.documentID = args.documentID;

        await ctx.stub.putState(issueRequest.requestID, Buffer.from(JSON.stringify(issueRequest)));

        //remove issue request from issuer's request array
        issueRequests.splice(index, 1);
        issuer.issueRequests = issueRequests;

        await ctx.stub.putState(issuer.issuerID, Buffer.from(JSON.stringify(issuer)));

        let response = `Identity with document id ${identity.documentID} is updated in the world state`;
        return response;
    }

    /**
     *
     * @param ctx
     * @param documentID
     * @param verifierID
     * @returns {Promise<string>}
     */
    async verifyIdentity(ctx, documentID, verifierID) {
        let documentExists = await this.assetExists(ctx, documentID);
        let verifierExists = await this.assetExists(ctx, verifierID);

        if (!documentExists) {
            throw new Error(`Identity with document id ${documentID} does not exist`);
        }

        if (!verifierExists) {
            throw new Error(`Verifier id ${verifierID} is invalid`);
        }

        let identityAsBytes = await ctx.stub.getState(documentID);
        let verifierAsBytes = await ctx.stub.getState(verifierID);
        let identity = JSON.parse(identityAsBytes);
        let verifier = JSON.parse(verifierAsBytes);

        if (!verifier.docTypes.contains(identity.documentType)) {
            throw new Error(`Verifier id ${verifierID} does not have access to verify`);
        }

        identity.verifierID = verifierID;

        await ctx.stub.putState(identity.documentID, Buffer.from(JSON.stringify(identity)));

        let response = `Identity with document id ${identity.documentID} is verified by verifier id ${verifierID}
         and updated in the world state`;
        return response;
    }


    /**
     *
     * @param ctx
     * @param userID
     * @param issuerID
     * @param documentType
     * @returns {Promise<string>}
     */
    async issueRequest(ctx, userID, issuerID, documentType, timeStamp, requestId) {
        let holderExists = await this.assetExists(ctx, userID);
        let issuerExists = await this.assetExists(ctx, issuerID);

        if (holderExists && issuerExists) {
            let holderAsBytes = await ctx.stub.getState(userID);
            let holder = JSON.parse(holderAsBytes);
            let issuerAsBytes = await ctx.stub.getState(issuerID);
            let issuer = JSON.parse(issuerAsBytes);

            if (issuer.issuerType === documentType) {
                //create issue request
                let issueRequest = await new IssueRequest(userID, issuerID, documentType, timeStamp, requestId);
                issueRequest.status = 'processing';
                await ctx.stub.putState(issueRequest.requestID, Buffer.from(JSON.stringify(issueRequest)));

                //add issue request to issuer's and holder's queue
                let issueRequestsAtIssuer = issuer.issueRequests;
                issueRequestsAtIssuer.push(issueRequest.requestID);
                issuer.issueRequests = issueRequestsAtIssuer;
                await ctx.stub.putState(issuer.issuerID, Buffer.from(JSON.stringify(issuer)));

                let issueRequestsAtHolder = holder.issueRequests;
                issueRequestsAtHolder.push(issueRequest.requestID);
                holder.issueRequests = issueRequestsAtHolder;
                await ctx.stub.putState(holder.userID, Buffer.from(JSON.stringify(holder)));

                let response = `Issue Request with request id ${issueRequest.requestID} has been created in
                the world state`;
                return response;
            }
        }

        throw new Error('Invalid Issue Request');
    }

    /**
     *
     * @param ctx
     * @param holderID
     * @param documentID
     * @param verifierID
     * @param timeStamp
     * @returns {Promise<string>}
     */
    async verifyRequest(ctx, holderID, documentID, verifierID, timeStamp, requestId) {
        let holderExists = await this.assetExists(ctx, holderID);
        let verifierExists = await this.assetExists(ctx, verifierID);
        let documentExists = await this.assetExists(ctx, documentID);

        if (holderExists && verifierExists && documentExists) {
            let holderAsBytes = await ctx.stub.getState(holderID);
            let holder = JSON.parse(holderAsBytes);
            let verifierAsBytes = await ctx.stub.getState(verifierID);
            let verifier = JSON.parse(verifierAsBytes);
            let documentAsBytes = await ctx.stub.getState(documentID);
            let document = JSON.parse(documentAsBytes);
            if (verifier.docTypes.contains(document.documentType)) {
                //create new verify request
                let verifyRequest = await new VerifyRequest(holderID, verifierID, documentID, timeStamp, requestId);
                verifyRequest.status = 'processing';
                await ctx.stub.putState(verifyRequest.requestID, Buffer.from(JSON.stringify(verifyRequest)));

                //update holder's profile to accommodate verify request
                holder.verifyRequests.push(verifyRequest.requestID);
                let accessRights = holder.accessRights;
                accessRights[documentID].push(verifierID);
                holder.accessRights = accessRights;
                await ctx.stub.putState(holderID, Buffer.from(JSON.stringify(holder)));

                //update verifyRequests list at verifier
                verifier.verifyRequests.push(verifyRequest.requestID);
                await ctx.stub.putState(verifierID, Buffer.from(JSON.stringify(verifier)));

                let response = `Verification Request with request id ${verifyRequest.requestID} has been created in
                the world state`;
                return response;
            }
        }
        throw new Error(`Invalid Verify Request`);
    }

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<string>}
     */
    async requestAccess(ctx, args) {
        args = JSON.parse(args);
        let requesterExists = await this.assetExists(ctx, args.requesterID);
        let holderExists = await this.assetExists(ctx, args.holderID);
        if (requesterExists && holderExists) {
            let holderAsBytes = await ctx.stub.getState(args.holderID);
            let holder = JSON.parse(holderAsBytes);
            let requesters = holder.requesters;
            requesters[args.requesterID].push(args.documentsRequested);

            await ctx.stub.putState(holder.userID, Buffer.from(JSON.stringify(holder)));

            return `the request to access the documents has been submitted with the holder`;
        }
        throw new Error(`this requester with id ${args.requesterID} or the holder with id ${args.holderID} doesn't exist`)
    }

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<string>}
     */
    async grantAccess(ctx, args) {
        args = JSON.parse(args);
        let requesterExists = await this.assetExists(ctx, args.requesterID);
        let holderExists = await this.assetExists(ctx, args.holderID);
        if (requesterExists && holderExists) {
            let holderAsBytes = await ctx.stub.getState(args.holderID);
            let holder = JSON.stringify(holderAsBytes);

            //remove requester from list
            let requesters = holder.requesters;
            delete requesters[args.requesterID];
            holder.requesters = requesters;

            //add permissions
            let documentID;
            for (documentID in args.permissionedIDs) {
                holder.accessRights[documentID].push(args.requesterID);
            }

            await ctx.stub.putState(args.holderID, Buffer.from(JSON.stringify(holder)));

            let response = `Access has been provided to the requester with the id ${args.requesterId}`;
            return response;
        }
        throw new Error(`this requester with id ${args.requesterID} or the holder with id ${args.holderID} doesn't exist`)
    }

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<string>}
     */
    async revokeAccess(ctx, args) {
        args = JSON.parse(args);
        let requesterExists = await this.assetExists(ctx, args.requesterID);
        let holderExists = await this.assetExists(ctx, args.holderID);
        if (requesterExists && holderExists) {
            let holderAsBytes = await ctx.stub.getState(args.holderID);
            let holder = JSON.stringify(holderAsBytes);
            let accessRights = holder.accessRights;
            if (args.requesterID in accessRights[args.documentID]) {
                let index = accessRights[args.documentID].indexOf(args.requesterID);
                accessRights[args.documentID].splice(index, 1);
                holder.accessRights = accessRights;
            }
            await ctx.stub.putState(args.holderID, Buffer.from(JSON.stringify(holder)));

            let response = `Access has been revoked to the requester with the id ${args.requesterId} for document
            ${args.documentID}`;
            return response;
        }
        throw new Error(`this requester with id ${args.requesterID} or the holder with id ${args.holderID} doesn't exist`)
    }

    /**
     *
     * @param ctx
     * @param objectType
     * @returns {Promise<string>}
     */
    async queryWithObjectType(ctx, objectType) {
        let queryString = {
            selector: {
                type: objectType
            }
        };

        return await this.queryWithQueryString(ctx, queryString);
    }

    /**
     *
     * @param ctx
     * @param queryString
     * @returns {Promise<string>}
     */
    async queryWithQueryString(ctx, queryString) {

        console.log('query String');
        console.log(JSON.stringify(queryString));

        let resultsIterator = await ctx.stub.getQueryResult(queryString);

        let allResults = [];

        // eslint-disable-next-line no-constant-condition
        while (true) {
            let res = await resultsIterator.next();

            if (res.value && res.value.value.toString()) {
                let jsonRes = {};

                console.log(res.value.value.toString('utf8'));

                jsonRes.Key = res.value.key;

                try {
                    jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    jsonRes.Record = res.value.value.toString('utf8');
                }

                allResults.push(jsonRes);
            }
            if (res.done) {
                console.log('end of data');
                await resultsIterator.close();
                console.info(allResults);
                console.log(JSON.stringify(allResults));
                return JSON.stringify(allResults);
            }
        }
    }

    /**
     *
     * @param ctx
     * @param id
     * @returns {Promise<boolean|boolean>}
     */
    async assetExists(ctx, id) {
        const buffer = await ctx.stub.getState(id);
        return (!!buffer && buffer.length > 0);
    }

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<void>}
     */
    async deleteAsset(ctx, args) {
        args = JSON.parse(args);
        let assetExists = await this.assetExists(ctx, args.assetId);
        if (assetExists) {
            await ctx.stub.deleteState(args.assetId);
            let response = `asset with id ${args.assetId} has been deleted`;
        } else {
            throw new Error(`No such asset with id ${args.assetId}`);
        }
    }

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<any>}
     */
    async getModifiedAsset(ctx, args) {

        args = JSON.parse(args);
        let assetExists = await this.assetExists(ctx, args.id);
        if (assetExists) {
            let assetAsBytes = await ctx.stub.getState(args.id);
            let asset = JSON.parse(assetAsBytes);
            delete asset.password;
            return asset;
        } else {
            throw new Error(`the asset with id ${args.id} doesn't exist`);
        }
    }

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<void>}
     */
    async updateAsset(ctx, args) {
        args = await JSON.parse(args);
        const exists = await this.assetExists(ctx, args.id);
        if (!exists) {
            throw new Error(`The ehr ${args.id} does not exist`);
        }
        await ctx.stub.putState(args.id, Buffer.from(JSON.stringify(args)));
    }


    /**
     *
     * @param ctx
     * @param assetId
     * @returns {Promise<any>}
     */
    async readAsset(ctx, assetId) {
        let assetExists = await this.assetExists(ctx, assetId);
        if (assetExists) {
            let assetAsBytes = await ctx.stub.getState(assetId);
            let asset = JSON.parse(assetAsBytes);
            return asset;
        } else {
            throw new Error(`asset with id ${assetId} doesn't exists`);
        }
    }

    /**
     *
     * @param ctx
     * @param args
     * @returns {Promise<boolean>}
     */
    async verifyPassword(ctx, args) {
        args = JSON.parse(args);
        let assetExists = await this.assetExists(ctx, args.userID);
        if (assetExists) {
            let assetAsBytes = await ctx.stub.getState(args.userID);
            let asset = JSON.parse(assetAsBytes);
            return asset.password === args.password;
        } else {
            throw new Error(`user with id ${args.userID} doesn't exists`);
        }
    }
}

module.exports = SsiSmartContractContract;
