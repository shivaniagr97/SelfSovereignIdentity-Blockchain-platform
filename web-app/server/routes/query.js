// noinspection BadExpressionStatementJS
'use-strict';
const {FileSystemWallet, Gateway, X509WalletMixin} = require('fabric-network');
const path = require('path');

const ccpPath = path.resolve(__dirname, '..', '..', '..', 'blockchain-network', 'first-network', 'connection-org1.json');

async function main() {

    try {

        const walletPath = path.join(process.cwd(), '../../wallet');
        const wallet = new FileSystemWallet(walletPath);

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, {
            wallet,
            identity: 'rahulparihar',
            discovery: {enabled: true, asLocalhost: true}
        });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('SSIContract');
        // let identity1 = {};
        // identity1.holderID = '9644143960';
        // identity1.documentID = 'id1';
        // identity1.documentType = 'aadhaar';
        // identity1.document = 'hashed document';
        // console.log(identity1);
        let user = {
            accessRights: {},
            address: "1k Mega Hostel NIT Warangal",
            city: "Warangal",
            contact: "09644143960",
            dateOfBirth: "1998-02-20",
            email: "prahul1@student.nitw.ac.in",
            firstName: "Rahu",
            issueRequests: [],
            lastName: "Parihar",
            pinCode: "506004",
            requesters: {},
            state: "Telangana",
            trustedContacts: [],
            type: "holder",
            userID: "rahulparihar",
            verifyRequests: []
        };
        // let identity1 = {};
        // identity1.holderID = '9644143960';
        // identity1.documentID = 'id1';
        // identity1.documentType = 'aadhaar';
        // identity1.document = 'hashed document';
        let issueRequest = {
            holderID: 'rahulparihar',
            issuerID: 'shivang',
            documentType: 'Passport',
            timeStamp: 'timeStamp',
            requestID: 'issueRequestId',
        };
        // let request = {
        //     holderID: '9644143960',
        //     requesterID: 'rahulparihar',
        //     documentsRequested: ['aadhaar'],
        // };
        // console.log(request);
        // user.holderID = user.userID;
        // user.requesterID = 'rahulparihar';
        // user.permissionedIDs = ['id1'];


        let issuer = {
            accessDocumentInfo: {},
            city: 'Warangal',
            contact: '09644143960',
            email: 'prahul1@student.nitw.ac.in',
            issueRequests: [],
            issuerID: 'shivang',
            issuerType: 'Passport',
            pinCode: '506004',
            state: 'Telangana',
            type: 'issuer'
        };

        let verifier = {
            accessDocumentInfo: {},
            contact: '09644143960',
            docTypes: 'Passport',
            email: 'prahul1@student.nitw.ac.in',
            type: 'verifier',
            verifierID: 'amitsharma',
            verifyRequests: []
        };
// let identity1 = {};
        // identity1.holderID = 'rahulparihar';
        // identity1.documentID = 'id1';
        // identity1.documentType = 'aadhaar';
        // identity1.document = 'hashed document';
        // identity1.id = 'id1';
        // let issueRequest = {
        //     holderID: 'rahulparihar',
        //     issuerID: 'shivang',
        //     documentType: 'Passport',
        //     timeStamp: 'timeStamp',
        //     requestID: 'issueRequestId',
        // };
        // let request = {
        //     holderID: 'rahulparihar',
        //     requesterID: 'shivang',
        //     permissionedIDs: ['id1'],
        // };

        let asset = {
            issuerID: 'shivang',
            assetId: 'issueRequest',
            listType: 'accessDocumentInfo',
        };
        issuer.id = issuer.issuerID;
        issuer.password = 'rahul';

        console.log(user);
        user.id = user.userID;
        let response = await contract.evaluateTransaction('updateAsset', JSON.stringify(user));
        response = JSON.stringify(response.toString());
        console.log(JSON.parse(response));

        gateway.disconnect();
    } catch (error) {
        console.error(`failed to perform transaction ${error}`);
        process.exit(1);
    }
}

main();