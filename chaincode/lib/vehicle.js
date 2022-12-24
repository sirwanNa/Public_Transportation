'use strict';

const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class Vehicle extends Contract{

    // ایجاد یک وسیله نقلیه جدید
    //ورودی
    //vehicleCode کد وسیله نقلیه
    //type نوع وسیله نقلیه شامل اتوبوس،قطار و..
    //factory کارخانه سازنده
    //constructionYear سال تولید
    //جهت ایجاد یک ای دی یونیک از ترکیب کد وسیله نقلیه و عنوان وسیله نقلیه استفاده شده است 
    async CreateVehicle(ctx,vehicleCode,type,factory,model,constructionYear) {
        if (!vehicleCode) {
            throw new Error('Vehicle Code could not be NULL');
        }
        var id=`${vehicleCode}_Vehicle`;
        const exists = await this._checkExistence(ctx, id);
        if (exists) {
            throw new Error(`The Vehicle ${vehicleCode} already exists`);
        }
        const vehicle = {
            ID: id,
            Type:type,
            Factory:factory,
            Model:model,
            ConstructionYear:constructionYear,
            IsDeleted:false,
            Entity:'Vehicle'
        };     
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(vehicle))));
        return JSON.stringify(vehicle);
    }
    //به روز رسانی وسیله نقلیه
    //ورودی
    //vehicleCode کد وسیله نقلیه
    //type نوع وسیله نقلیه شامل اتوبوس،قطار و..
    //factory کارخانه سازنده
    //constructionYear سال تولید
    //جهت ایجاد یک ای دی یونیک از ترکیب کد وسیله نقلیه و عنوان وسیله نقلیه استفاده شده است 
    async UpdateVehicle(ctx,vehicleCode,type,factory,model,constructionYear) {
        if (!vehicleCode) {
            throw new Error('Vehicle Code could not be NULL');
        }
        var id=`${vehicleCode}_Vehicle`;
        const exists = await this._checkExistence(ctx, id);
        if (!exists) {
            throw new Error(`The Station ${stationCode} does not exist`);
        }
        const vehicle = {
            ID: id,
            Type:type,
            Factory:factory,
            Model:model,
            ConstructionYear:constructionYear,
            IsDeleted:false,
            Entity:'Vehicle'
        };     
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(vehicle))));
        return JSON.stringify(vehicle);
    }
     //غیر فعال کردن یک وسیله نقلیه
     //ورودی
     //stationCode کد ایستگاه
     async DeleteVehicle(ctx,vehicleCode) {
        if (!vehicleCode) {
            throw new Error('Vehicle Code could not be NULL');
        }
        var id=`${vehicleCode}_Vehicle`;
        const exists = await this._checkExistence(ctx, id);
        if (!exists) {
            throw new Error(`The Station ${stationCode} does not exist`);
        }
        const objString=await this.ReadVehicle(ctx,vehicleCode);
        if(objString){
            const obj=JSON.parse(objString.toString());
            if(obj){
                const vehicle = {
                    ID: id,
                    Type:obj.Type,
                    Factory:obj.Factory,
                    Model:obj.Model,
                    ConstructionYear:obj.ConstructionYear,
                    IsDeleted:true,
                    Entity:'Vehicle'          
                };     
                await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(vehicle))));
                return JSON.stringify(vehicle);
            }
        }
        throw new Error(`An Error Occurred In Deleting Vehicle ${vehicleCode}`);
    }
    //خواندن اطلاعات وسیله نقلیه
    //ورودی
    //vehicleCode کد وسیله نقلیه
    async ReadVehicle(ctx, vehicleCode) {
        if (!vehicleCode) {
            throw new Error('Vehicle Code could not be NULL');
        }
        var id=`${vehicleCode}_Vehicle`;
        const resultJSON = await ctx.stub.getState(id);
        if (!resultJSON || resultJSON.length === 0) {
            throw new Error(`The Vehicle ${vehicleCode} does not exist`);
        }
        return resultJSON.toString();
    }

    async GetAllVehicles(ctx,type,factory,model) {
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
        allResults=allResults.filter(x=>x.Entity == 'Vehicle');
        if(type && type!=''){
            allResults=allResults.filter(x=>x.Type && x.Type == type);
        }
        if(factory && factory != ''){
            allResults=allResults.filter(x=>x.Factory && x.Factory == factory);
        }
        if(model && model != ''){
            allResults=allResults.filter(x=>x.Model && x.Model.toLowerCase().includes(model.toLowerCase()));
        }
        return JSON.stringify(allResults);
    } 
    // چک کردن اینکه قبلا موجودیتی با این ای دی موجود می باشد یا نه
    async _checkExistence(ctx, id) {
        const resultJSON = await ctx.stub.getState(id);
        return resultJSON && resultJSON.length > 0;
    }
}

module.exports = Vehicle;