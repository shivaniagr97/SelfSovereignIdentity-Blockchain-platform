/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { SsiSmartContractContract } = require('..');
let Holder = require('../lib/holder.js');
let Verifier = require('../lib/verifier.js');
let Issuer = require('../lib/issuer.js');
let Identity = require('../lib/identity.js');
const winston = require('winston');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext {

    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.logging = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }

}

describe('SsiSmartContractContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {

        let holder = {};
        holder.firstName = 'shivani';
        holder.lastName = 'agrawal';
        holder.userID = 'ashivani997';
        holder.password = '12345';
        holder.dateOfBirth = '09/07/1997';
        holder.address = 'B318, new LH, NITW';
        holder.city = 'warangal';
        holder.state = 'telangana';
        holder.pinCode = '506004';
        holder.contact = '9406474464';
        holder.email = 'ashivani997@gmail.com';
        holder.accessRights = {};
        holder.trustedContacts = [];

        let issuer = {};
        issuer.issuerID = 'issuer1';
        issuer.password = 'pass1';
        issuer.issuerType = 'passport';
        issuer.city = 'warangal';
        issuer.state = 'telangana';
        issuer.pinCode = '506004';
        issuer.contact = '1234567890';
        issuer.email = 'issuer@gov.in';

        let verifier = {};
        verifier.verifierID = 'verifier1';
        verifier.password = 'pass1';
        verifier.contact = '9089786751';
        verifier.email = 'verifier@gmail.com';
        verifier.docTypes = [];

        let identity = {};
        identity.holderID = 'ashivani997';
        identity.issuerID = 'issuer';
        identity.documentID = 'id1';
        identity.documentType = 'passport';
        identity.document = 'hashed document';

        contract = new SsiSmartContractContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"ssi smart contract 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"ssi smart contract 1002 value"}'));
        ctx.stub.getState.withArgs('ashivani997').resolves(Buffer.from(JSON.stringify(holder)));
        ctx.stub.getState.withArgs('issuer1').resolves(Buffer.from(JSON.stringify(issuer)));
        ctx.stub.getState.withArgs('verifier1').resolves(Buffer.from(JSON.stringify(verifier)));
        // ctx.stub.getState.withArgs('id1').resolves(Buffer.from(JSON.stringify(identity)));
    });

    describe('#ssiSmartContractExists', () => {

        it('should return true for a ssi smart contract', async () => {
            await contract.ssiSmartContractExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a ssi smart contract that does not exist', async () => {
            await contract.ssiSmartContractExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createSsiSmartContract', () => {

        it('should create a ssi smart contract', async () => {
            await contract.createSsiSmartContract(ctx, '1003', 'ssi smart contract 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"ssi smart contract 1003 value"}'));
        });

        it('should throw an error for a ssi smart contract that already exists', async () => {
            await contract.createSsiSmartContract(ctx, '1001', 'myvalue').should.be.rejectedWith(/The ssi smart contract 1001 already exists/);
        });

    });

    describe('#readSsiSmartContract', () => {

        it('should return a ssi smart contract', async () => {
            await contract.readSsiSmartContract(ctx, '1001').should.eventually.deep.equal({ value: 'ssi smart contract 1001 value' });
        });

        it('should throw an error for a ssi smart contract that does not exist', async () => {
            await contract.readSsiSmartContract(ctx, '1003').should.be.rejectedWith(/The ssi smart contract 1003 does not exist/);
        });

    });

    describe('#updateSsiSmartContract', () => {

        it('should update a ssi smart contract', async () => {
            await contract.updateSsiSmartContract(ctx, '1001', 'ssi smart contract 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"ssi smart contract 1001 new value"}'));
        });

        it('should throw an error for a ssi smart contract that does not exist', async () => {
            await contract.updateSsiSmartContract(ctx, '1003', 'ssi smart contract 1003 new value').should.be.rejectedWith(/The ssi smart contract 1003 does not exist/);
        });

    });

    describe('#deleteSsiSmartContract', () => {

        it('should delete a ssi smart contract', async () => {
            await contract.deleteSsiSmartContract(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a ssi smart contract that does not exist', async () => {
            await contract.deleteSsiSmartContract(ctx, '1003').should.be.rejectedWith(/The ssi smart contract 1003 does not exist/);
        });

    });

    describe('#initLedger', async () => {
        it('should update the result in the global state', async () => {
            let result = await contract.initLedger(ctx);

        });
    });

});
