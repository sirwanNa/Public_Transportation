'use strict';
const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');


class Travel extends Contract{
   // هنگامی که یک مسافر به یک ایستگاه وارد می شود/خارج می شود این متد فراخوانی می گردد که یک تراکنش جدید در بلاک چین ایجاد گردد
    //ورودی
    //ticketCode کد کارت سفر
    //stationCode کد ایستگاه
    //date تاریخ
    //جهت ایجاد یک ای دی یونیک از ترکیب کد وسیله نقلیه، کد ایستگاه، تاریخ و عنوان ورود استفاده شده است 
    async AddTransaction(ctx,ticketCode,stationCode,date){        
        if (!ticketCode) {
            throw new Error('Ticket Code could not be NULL');
        }
        if (!stationCode) {
            throw new Error('Station Code could not be NULL');
        }
        if (!date) {
            throw new Error('Date Code could not be NULL');
        }
        let type=await this._readTranscationType(ctx,ticketCode); 
        var id=`${ticketCode}_${stationCode}_${date}_${type}_Travel`; 
        if(type == 'Output'){
           await this._calculateTicketFee(ctx,ticketCode,stationCode,stationCode);
        }            
        let transaction = {
            ID: id,
            TicketCode:ticketCode,
            StationCode:stationCode,
            Date:date,
            Type:type,
            Entity:'Travel'
        };     
        /*await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(transaction))));
        return type;*/
        await this._putToState(ctx,id,transaction);
        return type;
        //return result;  
    }


   //تاریخچه یی از سفرهای انجام شده توسط این کارت سفر را به عنوان خروجی بر میگرداند
   async FindTravelHistory(ctx,ticketCode){   
     let transactionsList=(await this._getAllItems(ctx,'Travel',x=>x.TicketCode == ticketCode))
                            .sort((a,b)=>{return (new Date(b.Date)- new Date(a.Date));});
     return JSON.stringify(transactionsList);                    
   }

    //این متد جهت محاسبه هزینه سفر و کم کردن از کارت سفر می باشد
    //از نوع private
    //ورودی
    //ctx Context
    //ticketCode کد کارت سفر
    async _calculateTicketFee(ctx,ticketCode,stationCode){
        const ticketId=`${ticketCode}_Ticket`;      
        let currentTicket=await this._getItem(ctx,ticketId);
        var stationId=`${stationCode}_Station`;
        let currentStation=await this._getItem(ctx,stationId);
        let balance=parseFloat(currentTicket.Balance);
        if(currentStation.Type == 'Bus'){
            if(balance>=20000){
                balance=balance-20000;
            }
            else{
                balance=0;
            } 
        }
        else if(currentStation.Type == 'BRT'){
            if(balance>=30000){
                balance=balance-25000;
            }
            else{
                balance=0;
            } 
        }
        else if(currentStation.Type == 'SubWay'){
            if(balance>=30000){
                balance=balance-30000;
            }
            else{
                balance=0;
            } 
        }
            
        const updatedTicket = {
            ID: ticketId,
            TicketCode:ticketCode,
            Type:currentTicket.Type,
            Balance:balance,
            Creator:currentTicket.Creator,
            Date:(new Date()).toString(),
            PassengerCode:currentTicket.PassengerCode,
            Entity:'Ticket'
        };     
        let result=await this._putToState(ctx,ticketId,updatedTicket);
        return result;

        
        
        
    }
    //این متد با خواندن آخرین وضعیت کارت سفر نوع تراکنش که از نوع ورودی یا خروجی می باشد را تشخیص می دهد
    //ورودی
    //ticketCode کد کارت سفر
    async _readTranscationType(ctx,ticketCode){       
        let transactionsList=(await this._getAllItems(ctx,'Travel',x=>x.TicketCode == ticketCode))
                           .sort((a,b)=>{return (new Date(b.Date)- new Date(a.Date));});
        console.log('transactionsList',transactionsList);
        let type='Input';    
        if(transactionsList && transactionsList.length>0){
            let lastTransaction=transactionsList[0];
            if(lastTransaction){
                if(lastTransaction.Type == 'Input'){
                    type='Output';
                }
            }
        }  
        return type;
    }
        //جهت خواندن تمام اطلاعات بلاک چین
    //ورودی
    //entityName نوع موجودیت
    //filterFunc فانکشن جهت جستجو
    async _getAllItems(ctx,entityName,filterFunc){
        var allResults = [];       
        let iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            let strValue = Buffer.from(result.value.value.toString()).toString('utf8');
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
    //جهت خواندن اطلاعات یک موجودیت بر حسب ای دی آن
    //ورودی
    //id آی دی موجودیت از نوع استرینگ
    async _getItem(ctx,id){
        let objJSON = await ctx.stub.getState(id);
        if (!objJSON || objJSON.length === 0) {
                throw new Error(`The Entity ${id} does not exist`);
        }
        let obj=JSON.parse(objJSON);
        return obj;
    }
    async _putToState(ctx,id,obj){
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(obj))));
        return JSON.stringify(obj);
    }
}

module.exports = Travel;