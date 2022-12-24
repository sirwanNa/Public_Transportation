'use strict';

const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class Station extends Contract{

    // ایجاد یک ایستگاه جدید
    //ورودی
    //stationCode کد ایستگاه
    //name نام ایستگاه
    //address آدرس ایستگاه
    //gpsLocation موقعیت GPS
    //جهت ایجاد یک ای دی یونیک از ترکیب کدایستگاه،کد وسیله نقلیه و عنوان ایستگاه استفاده شده است 
    async CreateStation(ctx,stationCode,name,type,address,gpsLocation) {
        if (!stationCode) {
            throw new Error('Station Code could not be NULL');
        }
        if (!name) {
            throw new Error('Station Name could not be NULL');
        }
        var id=`${stationCode}_Station`;
        const exists = await this._checkExistence(ctx, id);
        if (exists) {
            throw new Error(`The Station ${stationCode} already exists`);
        }
        const station = {
            ID: id,
            StationCode:stationCode,
            Name:name,
            Type:type,
            Address:address,
            GPSLocation:gpsLocation,
            IsDeleted:false,
            Entity:'Station'            
        };     
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(station))));
        return JSON.stringify(station);
    }
    //به روز رسانی ایستگاه موجود
    //ورودی
    //stationCode کد ایستگاه
    //name نام ایستگاه
    //address آدرس ایستگاه
    //gpsLocation موقعیت GPS
    //جهت ایجاد یک ای دی یونیک از ترکیب کد کارت ایستگاه،کد وسیله نقلیه و عنوان ایستگاه استفاده شده است 
    async UpdateStation(ctx,stationCode, name,type,address,gpsLocation) {
        if (!stationCode) {
            throw new Error('Station Code could not be NULL');
        }
        if (!name) {
            throw new Error('Station Name could not be NULL');
        }
        var id=`${stationCode}_Station`;
        const exists = await this._checkExistence(ctx, id);
        if (!exists) {
            throw new Error(`The Station ${stationCode} does not exist`);
        }
        const station = {
            ID: id,
            StationCode:stationCode,
            Name:name,
            Type:type,
            Address:address,
            GPSLocation:gpsLocation,
            IsDeleted:false,
            Entity:'Station'            
        };     
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(station))));
        return JSON.stringify(station);
    }
     //غیر فعال کردن یک ایستگاه
     //ورودی
     //stationCode کد ایستگاه
    async DeleteStation(ctx,stationCode) {
        if (!stationCode) {
            throw new Error('Station Code could not be NULL');
        }
        var id=`${stationCode}_Station`;
        const exists = await this._checkExistence(ctx, id);
        if (!exists) {
            throw new Error(`The Station ${stationCode} does not exist`);
        }
        const objString=await this.ReadStation(ctx,stationCode);       
        if(objString){
            const obj=JSON.parse(objString.toString());            
            if(obj){
                const station = {
                    ID: id,
                    StationCode:obj.StationCode,
                    Name:obj.Name,
                    Address:obj.Address,
                    GPSLocation:obj.GPSLocation,
                    IsDeleted:true,
                    Entity:'Station'            
                };     
                await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(station))));
                return JSON.stringify(station);
            }
        }
        throw new Error(`An Error Occurred In Deleting Station ${stationCode}`);
    }
    //خواندن اطلاعات ایستگاه
    //ورودی
    //stationCode کد ایستگاه
    async ReadStation(ctx, stationCode) {
        if (!stationCode) {
            throw new Error('Station Code could not be NULL');
        }
        var id=`${stationCode}_Station`;
        const stationJSON = await ctx.stub.getState(id);
        if (!stationJSON || stationJSON.length === 0) {
            throw new Error(`The Station ${stationCode} does not exist`);
        }
        return stationJSON.toString();
    }


    //خواندن اطلاعات ایستگاه ها
    //ورودی ها
    //name  عنوان ایستگاه جهت جستجو که می تواند خالی باشد
    //stationCode  کد ایستگاه جهت جستجو که می تواند خالی باشد
    async GetAllStations(ctx,name,stationCode,type) {
        var allResults = [];       
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
        allResults=allResults.filter(x=>x.Entity == 'Station');
        if(name && name !=''){
            allResults=allResults.filter(x=>x.Name && x.Name.toLowerCase().includes(name.toLowerCase()));
        }
        if(stationCode && stationCode !=''){
            allResults=allResults.filter(x=>x.StationCode && x.StationCode.toLowerCase().includes(stationCode.toLowerCase()));
        }
        if(type && type != ''){
            allResults=allResults.filter(x=>x.Type && x.Type == type);
        }
        return JSON.stringify(allResults);
    } 

    // چک کردن اینکه قبلا موجودیتی با این ای دی موجود می باشد یا نه
    async _checkExistence(ctx, id) {
        const resultJSON = await ctx.stub.getState(id);
        return resultJSON && resultJSON.length > 0;
    } 
}

module.exports = Station;