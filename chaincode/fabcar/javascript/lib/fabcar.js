/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class FabCar extends Contract {

   //1 initledger
   //2 writedata
   //3 read data

    async initLedger(ctx){
        await ctx.stub.putState("test","hello world")
        return "success"
    }

    async writeData(ctx, key, value){
        //console.log ("***********",value)
        //value = JSON.parse(value)
        await ctx.stub.putstate(key,value)
        //await ctx.stub.putState(key, Buffer.from(JSON.stringify(value)))
        return value;
    }

    async writeJsonData(ctx, key, value){
        console.log ("***********",value)
        value = JSON.parse(value)
        //await ctx.stub.putstate(key,value)
        await ctx.stub.putState(key, Buffer.from(JSON.stringify(value)))
        
        return value;
    }

    async readData(ctx, key){
        let response = await ctx.stub.getState(key)
        response = response.toString('utf-8')
        response = JSON.parse(response)
        return response;
    }

    async getAllData(ctx){
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async queryPatientsByDiagnosis(ctx, diagnosis){
        let queryString = {}
        
        queryString.selector = {"diagnosis":diagnosis}
        let iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString))
        let result = await this.getIteratorData(iterator)

        return JSON.stringify(result);
    }

    async getIteratorData(iterator){

        let resultArray = []

        while(true){
            let res = await iterator.next()
            let resJson = {}
            if(res.value && res.value.value.toString()){
                resJson.key = res.value.key;
                resJson.value = JSON.parse(res.value.value.toString('utf-8'))
                resultArray.push(resJson)
            }

            if(res.done){
                await iterator.close();
                return resultArray
            }
        }
    }
}

module.exports = FabCar;
