/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class SsiSmartContractContract extends Contract {

    async ssiSmartContractExists(ctx, ssiSmartContractId) {
        const buffer = await ctx.stub.getState(ssiSmartContractId);
        return (!!buffer && buffer.length > 0);
    }

    async createSsiSmartContract(ctx, ssiSmartContractId, value) {
        const exists = await this.ssiSmartContractExists(ctx, ssiSmartContractId);
        if (exists) {
            throw new Error(`The ssi smart contract ${ssiSmartContractId} already exists`);
        }
        const asset = { value };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(ssiSmartContractId, buffer);
    }

    async readSsiSmartContract(ctx, ssiSmartContractId) {
        const exists = await this.ssiSmartContractExists(ctx, ssiSmartContractId);
        if (!exists) {
            throw new Error(`The ssi smart contract ${ssiSmartContractId} does not exist`);
        }
        const buffer = await ctx.stub.getState(ssiSmartContractId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async updateSsiSmartContract(ctx, ssiSmartContractId, newValue) {
        const exists = await this.ssiSmartContractExists(ctx, ssiSmartContractId);
        if (!exists) {
            throw new Error(`The ssi smart contract ${ssiSmartContractId} does not exist`);
        }
        const asset = { value: newValue };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(ssiSmartContractId, buffer);
    }

    async deleteSsiSmartContract(ctx, ssiSmartContractId) {
        const exists = await this.ssiSmartContractExists(ctx, ssiSmartContractId);
        if (!exists) {
            throw new Error(`The ssi smart contract ${ssiSmartContractId} does not exist`);
        }
        await ctx.stub.deleteState(ssiSmartContractId);
    }

}

module.exports = SsiSmartContractContract;
