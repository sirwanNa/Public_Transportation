'use strict';

const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class StationLine extends Contract{
    //انتساب یک ایستگاه به یک خط
    //ورودی
    //stationCode کد ایستگاه
    //lineCode کد خط
    //forwardIndex ترتیب ایستگاه در جهت رفت
    //backwardIndex ترتیب ایستگاه در جهت برگشت
    async CreateStationLine(ctx,stationCode,lineCode,forwardIndex,backwardIndex) {
        if (!stationCode) {
            throw new Error('Station Code could not be NULL');
        }
        if (!lineCode) {
            throw new Error('Line Code could not be NULL');
        }
        var id=`${stationCode}_${lineCode}_StationLine`;
        const exists = await this._checkExistence(ctx, id);
        if (exists) {
            throw new Error(`The Station ${stationCode} already has set to line ${lineCode}`);
        }
        const stationLine = {
            ID: id,
            StationCode:stationCode,
            LineCode:lineCode,
            ForwardIndex:forwardIndex,
            BackwardIndex:backwardIndex,
            IsDeleted:false,
            Entity:'StationLine'            
        };     
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(stationLine))));
        return JSON.stringify(stationLine);
    }

    //به روز رسانی انتساب یک ایستگاه به یک خط
    //ورودی
    //stationCode کد ایستگاه
    //lineCode کد خط
    //forwardIndex ترتیب ایستگاه در جهت رفت
    //backwardIndex ترتیب ایستگاه در جهت برگشت
    async UpdateStationLine(ctx,stationCode,lineCode,forwardIndex,backwardIndex) {
        if (!stationCode) {
            throw new Error('Station Code could not be NULL');
        }
        if (!lineCode) {
            throw new Error('Line Code could not be NULL');
        }
        var id=`${stationCode}_${lineCode}_StationLine`;
        const exists = await this._checkExistence(ctx, id);
        if (!exists) {
            throw new Error(`The Station ${stationCode} already exist in ${lineCode} line`);
        }
        const stationLine = {
            ID: id,
            StationCode:stationCode,
            LineCode:lineCode,
            ForwardIndex:forwardIndex,
            BackwardIndex:backwardIndex,
            IsDeleted:false,
            Entity:'StationLine'          
        };     
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(stationLine))));
        return JSON.stringify(stationLine);
    } 

     //غیر فعال کردن یک ایستگاه در خط
     //ورودی
     //stationCode کد ایستگاه
     async DeleteStationLine(ctx,stationCode,lineCode) {
        if (!stationCode) {
            throw new Error('Station Code could not be NULL');
        }
        if (!lineCode) {
            throw new Error('Line Code could not be NULL');
        }
        var id=`${stationCode}_${lineCode}_StationLine`;
        const exists = await this._checkExistence(ctx, id);
        if (!exists) {
            throw new Error(`The Station ${stationCode} does not exist In Line ${lineCode}`);
        }
        const objString=await this.ReadStationLine(ctx,stationCode,lineCode);
        if(objString){
            const obj=JSON.parse(objString.toString());
            if(obj){
                const stationLine = {
                    ID: id,
                    StationCode:obj.StationCode,
                    LineCode:obj.LineCode,
                    ForwardIndex:obj.ForwardIndex,
                    BackwardIndex:obj.BackwardIndex,
                    IsDeleted:true,
                    Entity:'StationLine'          
                };     
                await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(stationLine))));
                return JSON.stringify(stationLine);
            }
        }
        throw new Error(`An Error Occurred In Deleting Station ${stationCode}`);
    }
    //خواندن اطلاعات 
    //ورودی
    //stationCode کد ایستگاه
    //lineCode کد ایستگاه
    async ReadStationLine(ctx, stationCode,lineCode) {
        if (!stationCode) {
            throw new Error('Station Code could not be NULL');
        }
        if (!lineCode) {
            throw new Error('Line Code could not be NULL');
        }
        var id=`${stationCode}_${lineCode}_StationLine`;
        const stationJSON = await ctx.stub.getState(id);
        if (!stationJSON || stationJSON.length === 0) {
            throw new Error(`The Station ${stationCode} does not exist`);
        }
        return stationJSON.toString();
    }
    

    //لیست ایستگاه های یک خط را بر می گرداند
    //ورودی
    //lineCode شماره خط
    async GetAllStationsOfLine(ctx,lineCode) {
        var allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push(record);
            result = await iterator.next();
        }
        allResults=allResults.filter(x=>x.Entity == 'StationLine' && x.LineCode == lineCode);
        return JSON.stringify(allResults);
    } 
    // چک کردن اینکه قبلا موجودیتی با این ای دی موجود می باشد یا نه
    async _checkExistence(ctx, id) {
        const resultJSON = await ctx.stub.getState(id);
        return resultJSON && resultJSON.length > 0;
    } 
}

module.exports = StationLine;