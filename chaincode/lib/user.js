'use strict';

const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class User extends Contract {
    //ایجاد کاربر جدید
    //ورودی ها
    //firstName نام
    //familyName نام خانوادگی
    //code کد کاربر که باید یکتا باشد
    //type نوع کاربر که شامل مسافر یا کارمند می باشد
    async CreateUser(ctx,firstName,familyName,code,type) {
        var id=`${code}_User`;
        const exists = await this._checkExistence(ctx, id);
        if (exists) {
            throw new Error(`The User ${code} already exists`);
        }
        const user = {
            Id:id,
            FirstName:firstName,
            FamilyName:familyName,
            Code:code,
            Type:type,
            Entity:'User'
        };  

        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(user))));
        return JSON.stringify(user);
    }
    //به روز رسانی کاربر
    //firstName نام
    //familyName نام خانوادگی
    //code کد کاربر که باید یکتا باشد
    //type نوع کاربر که شامل مسافر یا کارمند می باشد
    async UpdateUser(ctx,firstName,familyName,code,type) {
        var id=`${code}_User`;
        const exists = await this._checkExistence(ctx, id);
        if (!exists) {
            throw new Error(`The User ${id} does not exist`);
        }

        const updatedUser = {
            Id:id,
            FirstName:firstName,
            FamilyName:familyName,
            Code:code,
            Type:type,
            Entity:'User'
        };       
        return ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(updatedUser))));
    }
    //خواندن اطلاعات کاربر
    //code کد کاربر که باید یکتا باشد
    async ReadUser(ctx, code) {
        var id=`${code}_User`;
        const assetJSON = await ctx.stub.getState(id); 
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`The User ${code} does not exist`);
        }
        return assetJSON.toString();
    }
    //جستجوی کاربران
    //ورودی ها
    //name نام کاربر که در صورتی که مقدار داشته باشد بر حسب آن جستجو انجام می گیرد
    //type نوع کاربر
    async GetAllUsers(ctx,name='',type='') {
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
        allResults=allResults.filter(x=>x.Entity == 'User');
        if(type){
            allResults=allResults.filter(x=>x.Type == type);
        }
        if(name){
            allResults=allResults.filter(x=>`${x.FirstName} ${x.FamilyName}`.toLowerCase().includes(name.toLowerCase()));
        }
        return JSON.stringify(allResults);
    }
    // چک کردن اینکه قبلا موجودیتی با این ای دی موجود می باشد یا نه
    async _checkExistence(ctx, id) {
        const resultJSON = await ctx.stub.getState(id);
        return resultJSON && resultJSON.length > 0;
    }
}
module.exports = User;