const express = require('express');
const router = express.Router();

const {FileSystemWallet, Gateway, X509WalletMixin} = require('fabric-network');
const path = require('path');
var handler = require('./sessionKeyHandler');

const ccpPath = path.resolve(__dirname, '..', '..', '..', 'blockchain-network', 'first-network', 'connection-org1.json');


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
                console.log(req.body);
                let requestType = req.body.requestType;
                console.log(req.body.requestType);
                let response = ["Incorrect"];
                if (requestType === 'issuer') {
                    let queryString = {
                        "selector": {
                            "type": requestType,
                            "issuerType": req.body.issuerType
                        }
                    };
                    console.log(queryString);
                    response = await contract.evaluateTransaction('queryWithQueryString', JSON.stringify(queryString));
                    response = JSON.parse(response.toString());
                    console.log(response);
                } else if (requestType === 'verifier') {
                    let queryString = {
                        "selector": {
                            "type": requestType,
                            "docTypes": [req.body.docTypes],
                        }
                    };
                    response = await contract.evaluateTransaction('queryWithQueryString', JSON.stringify(queryString));
                    response = JSON.parse(response.toString());
                } else if (requestType === 'serviceProvider') {
                    let queryString = {
                        "selector": {
                            "type": requestType,
                        }
                    };
                    console.log(queryString);
                    response = await contract.evaluateTransaction('queryWithQueryString', JSON.stringify(queryString));
                    response = JSON.parse(response.toString());
                    console.log(response);
                }
                for (let i = 0; i < response.length; i++) {
                    delete response[i].Record.password;
                    delete response[i].Record.issueRequests;
                    delete response[i].Record.verifyRequests;
                    delete response[i].Record.accessDocumentInfo;
                    delete response[i].Record.sessionKey;
                }
                console.log(response);
                res.send(response);
                gateway.disconnect();
            }
        } catch
            (error) {
            console.log('failed to fetch generic data' + error);
            res.send(['Incorrect']);
        }
    }
);

module.exports = router;