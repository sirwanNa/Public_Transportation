'use strict';

const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class LineEntrance extends Contract{
    // هنگام مورد یک وسیله نقلیه به خط  که توسط سنسورها و دوربین های نظارتی شناسایی شده یک تراکنش در بلاک چین انجام می شود
    //ورودی ها
    //lineCode کد یکتای خط 
    //vehicleType نوع وسیله نقلیه
    //plaqueNumber شماره پلاک
    //date تاریخ
     //جهت ایجاد یک ای دی یونیک از ترکیب کد خط  تاریخ و عنوان ورود استفاده شده است 
    async ComeIn(ctx,lineCode,vehicleType,plaqueNumber,date){
        if (!lineCode) {
            throw new Error('Line Code could not be NULL');
        }
        if (!date) {
            throw new Error('Date could not be NULL');
        }
        var id=`${lineCode}_${date}_comein`;
        const come_in = {
            ID: id,
            LineCode:lineCode,
            VehicleType:vehicleType,
            PlaqueNumber:plaqueNumber,
            Type:'Input',
            Date:date,
            Entity:'LineEntrance'            
        };     
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(come_in))));
        return JSON.stringify(come_in);

    }
      
    // هنگام خروج یک وسیله نقلیه از خط ویژه که توسط سنسورها و دوربین های نظارتی شناسایی شده یک تراکنش در بلاک چین انجام می شود
    //ورودی ها
    //lineCode کد یکتای خط 
    //vehicleType نوع وسیله نقلیه
    //plaqueNumber شماره پلاک
    //date تاریخ
    //جهت ایجاد یک ای دی یونیک از ترکیب کد خط  تاریخ و عنوان خروج استفاده شده است 
    async ComeOut(ctx,lineCode,vehicleType,plaqueNumber,date){
        if (!lineCode) {
            throw new Error('Line Code could not be NULL');
        }
        if (!date) {
            throw new Error('Date could not be NULL');
        }
        var id=`${lineCode}_${date}_comeout`;
        const come_out = {
            ID: id,
            LineCode:lineCode,
            VehicleType:vehicleType,
            PlaqueNumber:plaqueNumber,
            Type:'Output',
            Date:date,
            Entity:'LineEntrance'            
        };     
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(come_out))));
        return JSON.stringify(come_out);
    }
    
    //خواندن تاریخچه استفاده از خطوط 
    //ورودی ها
    //lineCode کد خط  که می تواند نال باشد در صورت نال بودن دیتای همه خطوط را بر می گرداند
    //vehicleType نوع وسیله نقلیه که می تواند نال باشد
    //fromDate از چه تاریخی که می تواند نال باشد
    //toDate تا چه تاریخی که می تواند نال باشد
    async ReadUsingHistory(ctx,lineCode,vehicleType,fromDate,toDate){
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
        allResults=allResults.filter(x=>x.Entity == 'LineEntrance' && x.LineCode == lineCode);
        if(vehicleType && vehicleType != ''){
            allResults=allResults.filter(x=>x.VehicleType == vehicleType);
        }
        if(fromDate && fromDate != ''){
            allResults=allResults.filter(x=>x.Date >= fromDate);
        }
        if(toDate && toDate != ''){
            allResults=allResults.filter(x=>x.Date <= toDate);
        }
        return JSON.stringify(allResults);
    }  

}

module.exports = LineEntrance;