// noinspection BadExpressionStatementJS
'use-strict';
const args = require('yargs').argv;

const {FileSystemWallet, Gateway, X509WalletMixin} = require('fabric-network');
const path = require('path');
var holder = require('./sessionKeyHandler');

const ccpPath = path.resolve(__dirname, '..', '..', '..', 'blockchain-network', 'first-network', 'connection-org1.json');

/**
 *  @author : Shivani Agrawal
 *  @Date : 22/02/2020
 */

async function main() {

    try {

        console.log("Enter ids");
        let username = args._[0];
        const walletPath = path.join(process.cwd(), '../../wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`************** Wallet path: ${walletPath} **************************`);


        const adminExists = await wallet.exists('admin');
        if (!adminExists) {
            console.log('Please run enrollAdmin.js file first ... ');
            return;
        }

        const gateway = new Gateway();
        await gateway.connect(ccpPath, {wallet, identity: 'admin', discovery: {enabled: true, asLocalhost: true}});

        // Get the CA client object from the gateway for interacting with the CA.
        const ca = gateway.getClient().getCertificateAuthority();
        const adminIdentity = gateway.getCurrentIdentity();

        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
            const contract = network.getContract('SSIContract');
            let response = await contract.evaluateTransaction('readSsiSmartContract',args._[0]);
            response = JSON.parse(response.toString());
            console.log(response);

        gateway.disconnect();
        // let encryptedSessionKey = await holder.generateSessionKey("pariharrahul");
        // console.log(encryptedSessionKey);
        // let response = await holder.verifySessionKey("pariharrahul", encryptedSessionKey);
        // console.log(response);
        // await holder.removeSessionKey("pariharrahul", encryptedSessionKey);


    } catch (error) {
        console.error(`Failed to delete voter ${error}`);
        process.exit(1);
    }
}

main();