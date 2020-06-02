const express = require('express');
const router = express.Router();

const {FileSystemWallet, Gateway, X509WalletMixin} = require('fabric-network');
const path = require('path');
var handler = require('./sessionKeyHandler');

const ccpPath = path.resolve(__dirname, '..', '..', '..', 'blockchain-network', 'first-network', 'connection-org1.json');

/**
 *  @author : Shivani Agrawal
 *  @Date : 01/01/2020
 */

router.post('/', async (req, res) => {

    try {
        console.log(req.body);
        req.body.id = req.body.verifierID || req.body.userID || req.body.issuerID;
        let sessionKeyExists = await handler.verifySessionKey(req.body.id, req.body.sessionKey);
        if (!sessionKeyExists) {
            res.send("Incorrect");
        } else {
            const walletPath = path.join(process.cwd(), '../wallet');
            const wallet = new FileSystemWallet(walletPath);

            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccpPath, {
                wallet,
                identity: req.body.id,
                discovery: {enabled: true, asLocalhost: true}
            });

            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork('mychannel');

            // Get the contract from the network.
            const contract = network.getContract('SSIContract');
            let response;

            if (req.body.type === 'verifier') {
                console.log("verifier side");
                if (req.body.listType === "verifyRequests") {
                    console.log(req.body);
                    response = await contract.submitTransaction('readVerifierAssets', JSON.stringify(req.body));
                    response = JSON.parse(response.toString());
                    console.log(response);
                } else {
                    let assetsArray = req.body.accessDocumentInfo;
                    response = [];
                    console.log(assetsArray);
                    for (let i = 0; i < assetsArray.length; i++) {
                        req.body.assetId = assetsArray[i];
                        console.log(req.body);
                        let responseArray = await contract.submitTransaction('readVerifierAssets', JSON.stringify(req.body));
                        responseArray = JSON.parse(responseArray.toString());
                        console.log(responseArray);
                        if (typeof responseArray === 'object') {
                            response.push(responseArray);
                        }
                    }
                }
            } else if (req.body.type === 'issuer') {
                console.log("issuer side");
                if (req.body.listType === "issueRequests") {
                    response = await contract.submitTransaction('readIssuerAssets', JSON.stringify(req.body));
                    response = JSON.parse(response.toString());
                    console.log(response);
                } else {
                    let assetsArray = req.body.accessDocumentInfo;
                    response = [];
                    console.log(assetsArray);
                    for (let i = 0; i < assetsArray.length; i++) {
                        req.body.assetId = assetsArray[i];
                        console.log(req.body);
                        let responseArray = await contract.submitTransaction('readIssuerAssets', JSON.stringify(req.body));
                        responseArray = JSON.parse(responseArray.toString());
                        console.log(responseArray);
                        if (typeof responseArray === 'object') {
                            response.push(responseArray);
                        }
                    }
                }
                console.log(response);
            } else if (req.body.type === 'holder') {
                console.log("holder side");
                let assetsArray = req.body.trustedContacts || req.body.issueRequests || req.body.verifyRequests || req.body.accessRights || req.body.requesters;
                response = [];
                console.log(assetsArray);
                for (let i = 0; i < assetsArray.length; i++) {
                    req.body.assetId = assetsArray[i];
                    console.log(req.body);
                    let responseArray = await contract.submitTransaction('readHolderAssets', JSON.stringify(req.body));
                    responseArray = JSON.parse(responseArray.toString());
                    console.log(responseArray);
                    if (typeof responseArray === 'object') {
                        response.push(responseArray);
                    }
                }
            }
            console.log(response);
            // Disconnect from the gateway.
            await gateway.disconnect();
            res.send(response);
        }
    } catch (error) {
        console.log(` ... Failed to submit Transaction to the ledger ${error} ... `);
    }
});

module.exports = router;