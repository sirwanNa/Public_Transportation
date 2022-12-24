'use strict';

const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class RepairingService extends Contract{
  
    // ایجاد یک سرویس دوره ایی در بلاک چین
    //ورودی ها
    //vehicleCode کد یکتای وسیله نقلیه
    //type نوع سرویس انجام شده شامل تعمیر، تعویض، چک کردن
    //date تاریخ انجام سرویس
    //kilometer کارکرد بر حسب کیلومتر
    //instrumentsList لیست قطعات تعویضی
    //repairer شخص تعمیر کار
    //desc توضیحات
    //جهت ایجاد یک ای دی یونیک از ترکیب کد وسیله نقلیه تاریخ و عنوان تعمیر استفاده شده است 
    async CreateService(ctx,vehicleCode,type,date,kilometer,instrumentsList,repairer,desc){
        if (!vehicleCode) {
            throw new Error('Vehicle Code could not be NULL');
        }
        if (!date) {
            throw new Error('Date could not be NULL');
        }
        var id=`${vehicleCode}_${date}_RepairingService`;
        const repairingService = {
            ID: id,
            VehicleCode:vehicleCode,
            Type:type,
            Date:date,
            Kilometer:kilometer,
            InstrumentsList:instrumentsList,
            Repairer:repairer,
            Desc:desc,
            Entity:'RepairingService'
        };     
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(repairingService))));
        return JSON.stringify(repairingService);
    }
    //متد جهت خواندن تمام اطلاعات بلاک چین
    //ورودی
    //entityName جهت جستجو مقادیر آن موجودیت
    async _getAllItems(ctx,entityName,filterFunc){
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
        if(entityName){
            allResults=allResults.filter(x=>x.Entity == entityName);
        }
        if(filterFunc){
            allResults=allResults.filter(filterFunc);
        }
        return allResults;
    }
    //خواندن تاریخچه یی از سرویس های انجام شده
    // ورودی ها
    //vehicleCode کد وسیله نقلیه که می تواند نال باشد . در صورتی که نال باشد تعمییراتانجام شده بر روی تمام وسایل نقلیه را به عنوان خروجی در نظر می گیرد
    //fromDate از چه تاریخی که می تواند نال باشد
    //toDate تا چه تاریخی که می تواند نال باشد
    //repairer شخص تعمیر کار که می تواند نال باشد
    async ReadRepairingHistory(ctx,vehicleCode,type,fromDate,toDate,repairer){
        var allResults =await this._getAllItems(ctx,'RepairingService');
        allResults=allResults.filter(x=> x.VehicleCode == vehicleCode);
        if(type && type !=''){
            allResults=allResults.filter(x=>x.Type == type);
        }
        if(fromDate && fromDate != ''){
            allResults=allResults.filter(x=>x.Date >= fromDate);
        }
        if(toDate && toDate != ''){
            allResults=allResults.filter(x=>x.Date <= toDate);
        }
        if(repairer && repairer != ''){
            allResults=allResults.filter(x=>x.Repairer == repairer);
        }
        return JSON.stringify(allResults);

    }
    //سرویس های که در آینده لازم می باشند را پیدا کرده و به عنوان خروجی بر می گرداند.
    // مثلا اینکه چه ئسیله نقلیه یی احتیاج به تعویض روغن و .. دارد
    //ورودی ها
    //year سال که می تواند نال باشد در صورتی که نال باشد سال جاری در نظر گرفته می شود
    //month ماه که می تواند نال باشد در صورتی که نال باشد ماه جاری در نظر گرفته می شود
    async FindNextNecessaryServices(ctx,year,month){
        const _requiredMonth_Check=2;
        const _requiredMonth_OilChange=1;
        let allResults =await this._getAllItems(ctx,undefined,x=>x.Type == 'Change' || x.Type =='Check');
        const repairingServicesList=allResults.filter(x=>x.Entity =='RepairingService'); 
        let query=this._groupBy(repairingServicesList,'VehicleCode');
        let finalResult=[];
        for(var group in query){
           const checksList=query[group].filter(x=>x.Type == 'Check')
                            .sort((a,b)=>{return (new Date(b.Date) - new Date(a.Date));});
           const oilChangesList=query[group].filter(x=>x.Type == 'Change' && x.InstrumentsList && x.InstrumentsList.includes('Oil'))
                                .sort((a,b)=>{return (new Date(b.Date) - new Date(a.Date));});
            const requiredCheckList=this._readRequiredCheckList(checksList,_requiredMonth_Check);
            if(requiredCheckList){
                finalResult.push(requiredCheckList);
            }
            const requiredOilChange=this._readRequiredOilChange(oilChangesList,_requiredMonth_OilChange);
            if(requiredOilChange){
                finalResult.push(requiredOilChange);
            }
                                

        }
        return JSON.stringify(finalResult);
    }
    _readRequiredCheckList=(checksList,requiredMonth_Check)=>{
        if(checksList && checksList.length>0){
            const lastCheckList=checksList[0];
            if(lastCheckList){
                const currentDate=new Date();
                if(currentDate.setMonth(currentDate.getMonth()-requiredMonth_Check)-(new Date(lastCheckList.Date))>=0){
                   return lastCheckList;
                }
            }
        }
        return;
    }
    _readRequiredOilChange=(oilChangesList,requiredMonth_Check)=>{
        if(oilChangesList && oilChangesList.length>0){
            const lastOilChange=oilChangesList[0];
            if(lastOilChange){
                const currentDate=new Date();
                if(currentDate.setMonth(currentDate.getMonth()-requiredMonth_Check)-(new Date(lastOilChange.Date))>=0){
                   return lastOilChange;
                }
            }
        }
        return;
    }
    _groupBy = (array, key) => {        
        return array.reduce((result, currentValue) => {          
          (result[currentValue[key]] = result[currentValue[key]] || []).push(
            currentValue
          );        
          return result;
        }, {}); 
      };
}

module.exports = RepairingService;