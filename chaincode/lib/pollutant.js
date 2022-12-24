'use strict';

const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class Pollutant extends Contract{
    // درج پارامترهای مربوط به آلودگی هوا که توسط سنسورهای مبروطه خوانده شده
    // ورودی ها
    //stationCode کد ایستگاه مربوطه
    //date  تاریخ
    //co2 مقدار پارامتر دی اکسید کربن در هوا
    //co مقدار پارامتر منو اکسید کربن در هوا
    //so2   مقدار پارامتر دی اکسید گوگرد در هوا
    //no2  مقدار پارامتر دی اکسید نیتروژن
    //o3  مقدار پارامتر اوزون در هوا
    //humidity مقدار رطوبت هوا
    //جهت ایجاد یک ای دی یونیک از ترکیب کد ایستگاه تاریخ و عنوان آلاینده هوا استفاده شده است 
    async InsertAirData(ctx,stationCode,date,co2,co,so2,no2,o3,humidity){
        if (!stationCode) {
            throw new Error('Station Code could not be NULL');
        }
        if (!date) {
            throw new Error('Date could not be NULL');
        }
        var id=`${stationCode}_${date}_AirPollutants`;
        const airParameters = {
            ID: id,
            StationCode:stationCode,
            Date:date,
            Co2:co2,
            Co:co,
            So2:so2,
            No2:no2,
            O3:o3,
            Humidity:humidity,
            Entity:'AirPollutant'
        };     
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(airParameters))));
        return JSON.stringify(airParameters);
    }
    // درج پارامترهای مربوط به آلودگی صوتی که توسط سنسورهای مبروطه خوانده شده
    //ورودی ها
    //stationCode کد ایستگاه مربوطه
    //date  تاریخ
    //l10 مقدار پارامتر L10
    //l50 مقدار پارامتر L50
    //l95 مقدار پارامتر L95
    //l99 مقدار پارامتر L99
    //leq مقدار پارامتر LEQ
    //SEL مقدار پارامتر SEL
    //SPL  مقدار پارامتر SPL
    //l_min  مقدار پارامتر LMin
    //l_max مقدار پارامتر LMax
     //جهت ایجاد یک ای دی یونیک از ترکیب کد ایستگاه تاریخ و عنوان آلاینده صوتی استفاده شده است 
    async InsertNoiseData(ctx,stationCode,date,l10,l50,l95,l99,leq,sel,spl,l_min,l_max){
        if (!stationCode) {
            throw new Error('Station Code could not be NULL');
        }
        if (!date) {
            throw new Error('Date could not be NULL');
        }
        var id=`${stationCode}_${date}_NoisePollutants`;
        const noiseParameters = {
            ID: id,
            StationCode:stationCode,
            Date:date,
            L10:l10,
            L50:l50,
            L95:l95,
            L99:l99,
            LEQ:leq,
            SEL:sel,
            SPL:spl,
            L_Min:l_min,
            L_Max:l_max,
            Entity:'NoisePollutant'
        };     
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(noiseParameters))));
        return JSON.stringify(noiseParameters);
    }

    // خواندن تاریخچه یی از آلودگی های ایستگاه ها
    //ورودی ها
    //stationCode  کد ایستگاه که می تواند نال باشد در صورتی که نال باشد دیتای تمام ایستگاه ها از بلاک چین خوانده می شود
    //fromDate از چه تاریخی که می تواند نال باشد
    //toDate تا چه تاریخی که می تواند نال باشد
    //type نوع آلودگی را مشخص می کند که می تواند مقادیر air ویا اینکه noise باشد
    async ReadPollutionHistory(ctx,stationCode,type,fromDate,toDate){
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
        allResults=allResults.filter(x=>(x.Entity == 'AirPollutant' || x.Entity == 'NoisePollutant') && x.StationCode == stationCode);
        if(type && type =='air'){
            allResults=allResults.filter(x=>x.Entity == 'AirPollutant');
        }
        else if(type && type == 'noise'){
            allResults=allResults.filter(x=>x.Entity == 'NoisePollutant');
        }
        if(fromDate){
            allResults=allResults.filter(x=>x.Date >= fromDate);
        }
        if(toDate){
            allResults=allResults.filter(x=>x.Date <= toDate);
        }
        return JSON.stringify(allResults);
    }  
     
}

module.exports = Pollutant;