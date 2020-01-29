/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { SsiSmartContractContract } = require('..');
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
        contract = new SsiSmartContractContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"ssi smart contract 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"ssi smart contract 1002 value"}'));
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

});