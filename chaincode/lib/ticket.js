'use strict';

const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class Ticket extends Contract{
   
    //این متد یک کارت سفر جدید ایجاد می نماید
    //type نوع کارت سفر  شامل یکبار مصرفه، قابل شارژ
    //initiateBalance مقدار موجودی اولیه
    //creator شخص ایجاد کننده
    //date تاریخ ایجاد
     //جهت ایجاد یک ای دی یونیک از ترکیب کد کارت سفر و عنوان بلیط استفاده شده است 
    async CreateTicket(ctx,ticketCode,type,initiateBalance,creator,date){
        if (!ticketCode) {
            throw new Error('Ticket Code could not be NULL');
        }
        var id=`${ticketCode}_Ticket`;
        const exists = await this._checkExistence(ctx, id);
        if (exists) {
            throw new Error(`The Ticket ${ticketCode} exist`);
        }
        const ticket = {
            ID: id,
            TicketCode:ticketCode,
            Type:type,
            Balance:initiateBalance,
            Creator:creator,
            Date:date,
            IsDeleted:false,
            PassengerCode:'',
            Entity:'Ticket'
        };     
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(ticket))));
        return JSON.stringify(ticket);
    }
    
    //این متد جهت به  روز رسانی کارت سفر می باشد
    //type نوع کارت سفر  شامل یکبار مصرفه، قابل شارژ
    //initiateBalance مقدار موجودی اولیه
    //creator شخص ایجاد کننده
    //date تاریخ ایجاد
     //جهت ایجاد یک ای دی یونیک از ترکیب کد کارت سفر و عنوان بلیط استفاده شده است 
     async UpdateTicket(ctx,ticketCode,type,initiateBalance,creator,date,passengerCode){
        if (!ticketCode) {
            throw new Error('Ticket Code could not be NULL');
        }
        var id=`${ticketCode}_Ticket`;
        const exists = await this._checkExistence(ctx, id);
        if (!exists) {
            throw new Error(`The Ticket ${ticketCode} does not exist`);
        }
        const ticket = {
            ID: id,
            TicketCode:ticketCode,
            Type:type,
            Balance:initiateBalance,
            Creator:creator,
            Date:date,
            IsDeleted:false,
            PassengerCode:passengerCode,
            Entity:'Ticket'
        };      
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(ticket))));
        return JSON.stringify(ticket);
    }

    // این متد یک کارت ایجاد شده را به یک مسافر اختصاص میدهد
    // ورودی ها
    //ticketCode کد یکتای کارت سفر 
    //passengerCode کد یکتای مسافر
    //date تاریخ 
     //جهت ایجاد یک ای دی یونیک از ترکیب کد کارت سفر و عنوان بلیط استفاده شده است 
    async AssignTicket(ctx,ticketCode,passengerCode,date){
        if (!ticketCode) {
            throw new Error('Ticket Code could not be NULL');
        }
        var id=`${ticketCode}_Ticket`;
        const exists = await this._checkExistence(ctx, id);
        if (!exists) {
            throw new Error(`The Ticket ${ticketCode} does not exist`);
        }
        const strValue = await ctx.stub.getState(id); 
        if(!strValue){
            throw new Error(`The Ticket ${ticketCode} does not exist`);
        }
        const currentTicket=JSON.parse(strValue);
        const ticket = {
            ID: id,
            TicketCode:ticketCode,
            Type:currentTicket.Type,
            Balance:currentTicket.Balance,
            Creator:currentTicket.Creator,
            Date:date,
            IsDeleted:false,
            PassengerCode:passengerCode            
        };     
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(ticket))));
        return JSON.stringify(ticket);
    }
     //غیر فعال کردن یک کارت سفر
     //ورودی
     //stationCode کد کارت سفر
     async DeleteTicket(ctx,ticketCode) {
        if (!ticketCode) {
            throw new Error('Ticket Code could not be NULL');
        }
        var id=`${ticketCode}_Ticket`;
        const exists = await this._checkExistence(ctx, id);
        if (!exists) {
            throw new Error(`The Station ${stationCode} does not exist`);
        }
        const objString=await this.ReadTicket(ctx,ticketCode);
        if(objString){
            const obj=JSON.parse(objString.toString());
            if(obj){
                const ticket = {
                    ID: id,
                    TicketCode:obj.TicketCode,
                    Type:obj.Type,
                    Balance:obj.Balance,
                    Creator:obj.Creator,
                    Date:new Date(),
                    IsDeleted:true,
                    PassengerCode:obj.PassengerCode,
                    Entity:'Ticket'        
                };     
                await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(ticket))));
                return JSON.stringify(ticket);
            }
        }
        throw new Error(`An Error Occurred In Deleting Ticket ${ticketCode}`);
    }
    //خواندن مشخصات کارت سفر شامل موجودی و شخص اختصاص یافته به آن
    // ورودی ها
    //ticketCode کد یکتای کارت سفر 
    async ReadTicket(ctx, ticketCode) {
        if (!ticketCode) {
            throw new Error('Ticket Code could not be NULL');
        }
        var id=`${ticketCode}_Ticket`;
        const ticketJSON = await ctx.stub.getState(id);
        if (!ticketJSON || ticketJSON.length === 0) {
            throw new Error(`The Ticket ${ticketCode} does not exist`);
        }
        return ticketJSON.toString();
    }
    // این متد مقدار موجودی یک کارت سفر را تغییر میدهد
    // ورودی ها
    //ticketCode کد یکتای کارت سفر 
    //balance مقدار موجودی جدید
    //date تاریخ 
     //جهت ایجاد یک ای دی یونیک از ترکیب کد کارت سفر و عنوان بلیط استفاده شده است 
    async RechargeTicket(ctx,ticketCode,balance,date){
        if (!ticketCode) {
            throw new Error('Ticket Code could not be NULL');
        }
        var id=`${ticketCode}_Ticket`;
        const exists = await this._checkExistence(ctx, id);
        if (!exists) {
            throw new Error(`The Ticket ${ticketCode} does not exist`);
        }
        const strValue = await ctx.stub.getState(id); 
        if(!strValue){
            throw new Error(`The Ticket ${ticketCode} does not exist`);
        }
        const currentTicket=JSON.parse(strValue);
        const ticket = {
            ID: id,
            TicketCode:ticketCode,
            Type:currentTicket.Type,
            Balance:balance,
            Creator:currentTicket.Creator,
            Date:date,
            PassengerCode:currentTicket.PassengerCode,
            Entity:'Ticket'
        };     
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(ticket))));
        return JSON.stringify(ticket);
    }

    
    //این متد لیستی از کارت های سفر ایجاد شده را بر می گرداند
    // ورودی ها
    //fromDate از چه تاریخی که می تواند نال باشد
    //toDate تا چه تاریخی که می تواند نال باشد
    //creatorCode کد اپراتور که می تواند نال باشد 
    //passengerCode کد کاربر یا مسافر که می تواند نال باشد
    async ReadTickesList(ctx,fromDate,toDate,creatorCode,passengerCode){      
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
        allResults=allResults.filter(x=>x.Entity == 'Ticket');
        if(fromDate && fromDate !=''){
            allResults=allResults.filter(x=>x.Date && x.Date >= fromDate);
        }
        if(toDate && toDate !=''){
            allResults=allResults.filter(x=>x.Date && x.Date <= toDate);
        }
        if(creatorCode && creatorCode != ''){
            allResults=allResults.filter(x=>x.Creator && x.Creator == creatorCode);
        }
        if(passengerCode && passengerCode != ''){
            allResults=allResults.filter(x=>x.PassengerCode && x.PassengerCode == passengerCode);
        }
        return JSON.stringify(allResults);
    }
    // چک کردن اینکه قبلا موجودیتی با این ای دی موجود می باشد یا نه
    async _checkExistence(ctx, id) {
        const resultJSON = await ctx.stub.getState(id);
        return resultJSON && resultJSON.length > 0;
    }
}

module.exports = Ticket;