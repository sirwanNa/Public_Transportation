'use strict';

const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class Line extends Contract{
    // ایجاد یک خط جدید در بلاک چین
    //ورودی
    //lineCode کدیکتای خطویژه
    //startPosition موقعیت شروع
    //endPosition موقعیت پایان
    //desc توضیحات
     //جهت ایجاد یک ای دی یونیک از ترکیب کد خط و عنوان خط استفاده شده است 
    async CreateLine(ctx,title,lineCode,startPosition,endPosition,desc){
        if (!lineCode) {
            throw new Error('Line Code could not be NULL');
        }
        let id=`${lineCode}_Line`;
        const exists = await this._checkExistence(ctx, id);
        if (exists) {
            throw new Error(`The Special Line ${lineCode} already exists`);
        }

        const specialLine = {
            ID: id,
            Title:title,
            LineCode:lineCode,
            StartPosition:startPosition,
            EndPosition:endPosition,
            Desc:desc,
            IsDeleted:false,
            Entity:'Line'
        };        
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(specialLine))));
        return JSON.stringify(specialLine);
    }
    // به روز رسانی یک خط
    //ورودی
    //lineCode کدیکتای خطویژه
    //startPosition موقعیت شروع
    //endPosition موقعیت پایان
    //desc توضیحات
     //جهت به روز رسانی یک ای دی یونیک از ترکیب کد خط و عنوان خط استفاده شده است 
    async UpdateLine(ctx,title,lineCode,startPosition,endPosition,desc) {
        if (!lineCode) {
            throw new Error('Line Code could not be NULL');
        }
        let id=`${lineCode}_Line`;
        const exists = await this._checkExistence(ctx, id);
        if (!exists) {
            throw new Error(`The Line ${lineCode} does not exist`);
        }
        const specialLine = {
            ID: id,
            Title:title,
            LineCode:lineCode,
            StartPosition:startPosition,
            EndPosition:endPosition,
            Desc:desc,
            IsDeleted:false,
            Entity:'Line'
        };      
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(specialLine))));
        return JSON.stringify(specialLine);
    }

     //جهت غیر فعال کردن یک خط
     //ورودی
     //lineCode  کد خط
    async DeleteLine(ctx,lineCode) {
        if (!lineCode) {
            throw new Error('Line Code could not be NULL');
        }
        let id=`${lineCode}_Line`;
        const exists = await this._checkExistence(ctx, id);
        if (!exists) {
            throw new Error(`The Line ${lineCode} does not exist`);
        }
        let lineString=await this.ReadLine(ctx,lineCode);
        if(lineString){
            let lineObj=JSON.parse(lineString); 
            if(lineObj){
                const specialLine = {
                    ID: id,
                    Title:lineObj.Title,
                    LineCode:lineObj.LineCode,
                    StartPosition:lineObj.StartPosition,
                    EndPosition:lineObj.EndPosition,
                    Desc:lineObj.Desc,
                    IsDeleted:true,
                    Entity:'Line'
                };      
                await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(specialLine))));
                return JSON.stringify(specialLine);
            }
            else{
                console.log('Line Not Found');
                return null;
            }

        }
        else{
            console.log('Line Not Found');
            return null;
        }

    }

    //خواندن اطلاعات خط
    //lineCode کد خط  که باید یکتا باشد
    async ReadLine(ctx, lineCode) {
        var id=`${lineCode}_Line`;
        const assetJSON = await ctx.stub.getState(id); 
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`The Line ${code} does not exist`);
        }
        return assetJSON.toString();
    }
    //خط اطلاعات خطوط به صورت لیست
    //ورودی ها
    //title عنوان خط جهت جستجو که می تواند خالی باشد
    //lineCode کد خط جهت جستجو که می تواند خالی باشد
    async GetAllLines(ctx,title,lineCode) {
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
        allResults=allResults.filter(x=>x.Entity == 'Line');
        if(title && title != ''){
            allResults=allResults.filter(x=>x.Title && x.Title.toLowerCase().includes(title.toLowerCase()));
        }
        if(lineCode && lineCode != ''){
            allResults=allResults.filter(x=>x.LineCode && x.LineCode.toLowerCase().includes(lineCode.toLowerCase()));
        }
        return JSON.stringify(allResults);
    }
    // چک کردن اینکه قبلا موجودیتی با این ای دی موجود می باشد یا نه
    async _checkExistence(ctx, id) {
        const resultJSON = await ctx.stub.getState(id);
        return resultJSON && resultJSON.length > 0;
    }
}

module.exports = Line;