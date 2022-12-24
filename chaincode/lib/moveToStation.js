'use strict';

const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class MoveToStations extends Contract{

    // هنگامی که یک وسیله نقلیه به ایستگاه وارد می شود این تراکنش فراخونی می گردد
    //ورودی
    //stationCode کد ایستگاه  
    //lineCode کد خط ویژه
    //vehicleCode کد وسیله نقلیه
    //date تاریخ
    //جهت ایجاد یک ای دی یونیک از ترکیب کد کارت ایستگاه،کد وسیله نقلیه و عنوان ایستگاه استفاده شده است 
    async Input(ctx,stationCode,lineCode,vehicleCode,date,direction){
        let stationLineId;
        const stationLinesList=await this._getAllItems(ctx,'StationLine',x=>x.StationCode == stationCode && x.LineCode == lineCode);
        if(stationLinesList && stationLinesList.length>0){
            stationLineId=stationLinesList[0].ID;
        }
        if (!stationLineId) {
            throw new Error('Station Line Id could not be NULL');            
        }
        if (!vehicleCode) {
            throw new Error('Vehicle Code could not be NULL');
        }
        var round=await this._calculateRound(ctx,stationLineId,vehicleCode,'Input',direction);                     
        var id=`${stationCode}_${vehicleCode}_${date}_Input_Station`;
        const input = {
            ID: id,
            StationLineId:stationLineId,
            VehicleCode:vehicleCode,
            Type:'Input',
            Date:date,
            Round:round,
            Direction:direction,
            Entity:'MoveToStation'
        };     
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(input))));
        return JSON.stringify(input);
    }
        // هنگامی که یک وسیله نقلیه به ایستگاه وارد می شود این تراکنش فراخونی می گردد
    //ورودی
    //id ای دی
    //stationLineId کد ایستگاه در خط
    //vehicleCode کد وسیله نقلیه
    //date تاریخ
    //جهت ایجاد یک ای دی یونیک از ترکیب کد کارت ایستگاه،کد وسیله نقلیه و عنوان ایستگاه استفاده شده است 
    async Input_V2(ctx,id,stationLineId,vehicleCode,date,direction){
        if (!id) {
            throw new Error('Id could not be NULL');            
        }
        if (!stationLineId) {
            throw new Error('Station Line Id could not be NULL');            
        }
        if (!vehicleCode) {
            throw new Error('Vehicle Code could not be NULL');
        }
        var round=await this._calculateRound(ctx,stationLineId,vehicleCode,'Input',direction);                    
        const input = {
            ID: id,
            StationLineId:stationLineId,
            VehicleCode:vehicleCode,
            Type:'Input',
            Date:date,
            Round:round,
            Direction:direction,
            Entity:'MoveToStation'
        };     
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(input))));
        return JSON.stringify(input);
    }
    // هنگامی که یک وسیله نقلیه از ایستگاه خارج می شود این تراکنش فراخونی می گردد
    //ورودی
    //stationCode کد ایستگاه  
    //lineCode کد خط ویژه
    //vehicleCode کد وسیله نقلیه
    //date تاریخ
    //جهت ایجاد یک ای دی یونیک از ترکیب کدایستگاه،کد وسیله نقلیه و عنوان ایستگاه استفاده شده است 
    async Output(ctx,stationCode,lineCode,vehicleCode,date,direction){
        let stationLineId;
        const stationLinesList=await this._getAllItems(ctx,'StationLine',x=>x.StationCode == stationCode && x.LineCode == lineCode);
        if(stationLinesList && stationLinesList.length>0){
            stationLineId=stationLinesList[0].ID;
        }
        if (!stationLineId) {
            throw new Error('Station Line Id could not be NULL');            
        }
        if (!vehicleCode) {
            throw new Error('Vehicle Code could not be NULL');
        }
        var round=await this._calculateRound(ctx,stationLineId,vehicleCode,'Output',direction);                     
        var id=`${stationCode}_${vehicleCode}_${date}_Output_Station`;
        const output = {
            ID: id,
            StationLineId:stationLineId,
            VehicleCode:vehicleCode,
            Type:'Output',
            Date:date,
            Round:round,
            Entity:'MoveToStation'
        };     
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(output))));
        return JSON.stringify(output);
    }
        // هنگامی که یک وسیله نقلیه از ایستگاه خارج می شود این تراکنش فراخونی می گردد
    //ورودی
    //id ای دی
    //stationLineId ای دی ایستگاه در خط
    //vehicleCode کد وسیله نقلیه
    //date تاریخ
    //جهت ایجاد یک ای دی یونیک از ترکیب کدایستگاه،کد وسیله نقلیه و عنوان ایستگاه استفاده شده است 
    async Output_V2(ctx,id,stationLineId,vehicleCode,date,direction){
        if (!id) {
            throw new Error('Id could not be NULL');            
        }
        if (!stationLineId) {
            throw new Error('Station Line Id could not be NULL');            
        }
        if (!vehicleCode) {
            throw new Error('Vehicle Code could not be NULL');
        }
        var round=await this._calculateRound(ctx,stationLineId,vehicleCode,'Output',direction);                     
        const output = {
            ID: id,
            StationLineId:stationLineId,
            VehicleCode:vehicleCode,
            Type:'Output',
            Date:date,
            Round:round,
            Entity:'MoveToStation'
        };     
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(output))));
        return JSON.stringify(output);
    }
    //پیدا کردن وسیله های نقلیه که به ایستگاه نزدیک می شوند
    //ورودی متد کد یکتای ایستگاه می باشد    
    async FindComingVehicles(ctx,lineCode,stationCode,direction){
        var allResults = await this._getAllItems(ctx);
        var stationLine=this._findStationLine(allResults,lineCode,stationCode);
        let modelResult=[];
        let stationIndex=0;
        let prev_StationLineId;
        if(stationLine){           
            if(direction == 0){
                if(stationLine.ForwardIndex>1){
                    stationIndex=parseInt(stationLine.ForwardIndex)-1;
                }
            }
            else if(direction == 1) {
                if(stationLine.BackwardIndex>1){
                    stationIndex=parseInt(stationLine.BackwardIndex)-1;
                }
            }
            
            let stationLinesList;
            if(direction == 0){
                stationLinesList= await this._getAllItems(ctx,'StationLine',x=>x.LineCode == lineCode && x.ForwardIndex == stationIndex);
            }
            else if(direction == 1){
                stationLinesList= await this._getAllItems(ctx,'StationLine',x=>x.LineCode == lineCode && x.BackwardIndex == stationIndex);
            }
            if(stationLinesList && stationLinesList.length>0){
                prev_StationLineId=stationLinesList[0].ID;
            }


            let prevStation_transactionsList=await this._getAllItems(ctx,'MoveToStation',x=>x.StationLineId == prev_StationLineId && x.Type =='Output');
            let current_transactionsList=await this._getAllItems(ctx,'MoveToStation',x=>x.StationLineId == stationLine.ID && x.Type =='Input');

            if(prevStation_transactionsList && prevStation_transactionsList.length>0){
                let groupsList=this._groupBy(prevStation_transactionsList,'VehicleCode');
                for(groupName in groupsList){
                  let vehiclesList=groupsList[groupName].sort((a,b)=>{return b.Round - a.Round;});
                  if(vehiclesList && vehiclesList.length>0){
                     const round=vehiclesList[0].Round;
                     let transactionInThisRound=current_transactionsList.filter(x=>x.Round == round);
                     if(!(transactionInThisRound && transactionInThisRound.length>0)){
                        modelResult.push(vehiclesList[0]);
                     }
                  }
                }
            }                          
        }
        return JSON.stringify(modelResult);        

    } 
    // خواندن تاریخچه یی از حرکت وسایل نقلیه مابین دو ایستگاه
    //ورودی ها کد یکتی ایستگاه مبدا و مقصد می باشد
    async ReadHistoryOfMovement(ctx,lineCode,stationCode,direction,fromDate,toDate)
    {
        var allResults =await this._getAllItems(ctx);
        var stationLine=this._findStationLine(allResults,lineCode,stationCode);      
        var stationLineId;  
        if(stationLine){
            stationLineId=stationLine.ID;
        }              
        var moveToStationsList=allResults.filter(x=>x.Entity == 'MoveToStation' && x.StationLineId == stationLineId);
        if(direction && direction != ''){
            moveToStationsList=allResults.filter(x=>x.Direction == direction);
        }
        if(fromDate && fromDate != ''){
            moveToStationsList=moveToStationsList.filter(x=>x.Date >= fromDate);
        }
        if(toDate && toDate != ''){
            moveToStationsList=moveToStationsList.filter(x=>x.Date <= toDate);
        } 
        return JSON.stringify(moveToStationsList);
    }   
    async _calculateRound(ctx,stationLineId,vehicleCode,type,direction){
        var round=1;
        var moveToStationsList=await this._getAllItems(ctx,'MoveToStation',x=> x.StationLineId == stationLineId && x.Direction == direction
                               && x.VehicleCode == vehicleCode && x.Type == type && this._comapreDates(x.Date,new Date()));
        if(moveToStationsList && moveToStationsList.length>0){
            moveToStationsList=moveToStationsList.sort((x,y)=>{return (new Date(y.Date)- new Date(x.Date))});
            if(moveToStationsList[0]){
                round=parseInt(moveToStationsList[0].Round)+1;
            }
        }
        return round;  
    }
    _comapreDates(firstDate,secondDate){
       var t1=new Date(firstDate);
       var t2=new Date(secondDate);
       return t1.getFullYear() == t2.getFullYear() && t1.getMonth() == t2.getMonth() && t1.getDate() == t2.getDate();
    }
    async _getAllItems(ctx,entityName,filterFunction){
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
        if(filterFunction){
            allResults=allResults.filter(filterFunction);
        }
        return allResults;
    }
    _findStationLine(allResults,lineCode,stationCode){
        var stationLine;
        var stationLinesList=allResults.filter(x=>x.Entity == 'StationLine' && x.LineCode == lineCode 
                                && x.StationCode == stationCode);
        if(stationLinesList && stationLinesList.length>0){
            stationLine = stationLinesList[0];
        }   
        return stationLine;
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

module.exports = MoveToStations;