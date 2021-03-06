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
        let sessionKeyExists = await handler.verifySessionKey(req.body.userID, req.body.sessionKey);
        if (!sessionKeyExists) {
            res.send("Incorrect");
        } else {
            const walletPath = path.join(process.cwd(), '../wallet');
            const wallet = new FileSystemWallet(walletPath);

            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccpPath, {
                wallet,
                identity: req.body.userID,
                discovery: {enabled: true, asLocalhost: true}
            });

            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork('mychannel');

            // Get the contract from the network.
            const contract = network.getContract('SSIContract');
            req.body.issueRequestId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

            // Submit the specified transaction.
            let response = await contract.submitTransaction('issueRequest', req.body.userID, req.body.issuerID,
                req.body.documentType, Date.now().toString(), req.body.issueRequestId);
            response = JSON.stringify(response.toString());
            console.log(response);

            // Disconnect from the gateway.
            await gateway.disconnect();

            res.send("Correct");
        }
    } catch (error) {
        console.log(` ... Failed to submit Transaction to the ledger ${error} ... `);
    }

});

module.exports = router;