import {StationLineDTO} from '../viewModels/stationLineModel';
import { Contract } from 'fabric-network/lib/contract';
import {prettyJSONString } from '../utils//AppUtil';
import {LogType,TransactionType} from '../logger/loggerModel';
import {LoggerService} from '../logger/loggerService';
import {IStationLineRepo} from '../irepositories/istationLineRepo'

export class StationLineRepo implements IStationLineRepo{
    private _contract:Contract;
    private _loggerService:LoggerService;
    constructor(contract:Contract,nodesCount:number){
        this._contract=contract;
        this._loggerService=new LoggerService(nodesCount);
    }
    public async CreateStationLine(stationCode:string,lineCode:string,forwardIndex:number,backwardIndex:number):Promise<boolean>
    {
        try
        {
            let startDate:Date=new Date();
            await this._contract.submitTransaction('CreateStationLine',stationCode,lineCode,forwardIndex.toString(),backwardIndex.toString());
            let endDate:Date=new Date();
            var durationDate:any=endDate.getTime()-startDate.getTime();
            await this._loggerService.LogAsync(LogType.EstimationTime,'StationLine','CreateStationLine',durationDate.toString(),
                                   TransactionType.Write);
            console.log(`Station ${stationCode} Has Been Set To Line ${lineCode}`);
            return true;
        }
        catch(error){
           await this._loggerService.LogAsync(LogType.Error,'StationLine','CreateStationLine',error.toString(),TransactionType.Write);
           console.log(error); 
           return false;
        }
    }
    public async UpdateStationLine(stationCode:string,lineCode:string,forwardIndex:number,backwardIndex:number):Promise<boolean>
    {
        try
        {
            let startDate:Date=new Date();
            await this._contract.submitTransaction('UpdateStationLine',stationCode,lineCode,forwardIndex.toString(),backwardIndex.toString());
            let endDate:Date=new Date();
            var durationDate:any=endDate.getTime()-startDate.getTime();
            await this._loggerService.LogAsync(LogType.EstimationTime,'StationLine','UpdateStationLine',durationDate.toString(),
                                   TransactionType.Write);
            console.log(`Station ${stationCode} Has Been Updated To Line ${lineCode}`);
            return true;
        }
        catch(error){
           await this._loggerService.LogAsync(LogType.Error,'StationLine','UpdateStationLine',error.toString(),TransactionType.Write);
           console.log(error); 
           return false;
        }
    }
    public async DeleteStationLine(stationCode:string,lineCode:string):Promise<boolean>
    {
        try
        {
            let startDate:Date=new Date();
            await this._contract.submitTransaction('DeleteStationLine',stationCode,lineCode);
            let endDate:Date=new Date();
            var durationDate:any=endDate.getTime()-startDate.getTime();
            await this._loggerService.LogAsync(LogType.EstimationTime,'StationLine','DeleteStationLine',durationDate.toString(),
                                   TransactionType.Write);
            console.log(`Station ${stationCode} In Line ${lineCode} Has Been Deactived`);
            return true;
        }
        catch(error){
           await this._loggerService.LogAsync(LogType.Error,'StationLine','DeleteStationLine',error.toString(),TransactionType.Write);
           console.log(error); 
           return false;
        }
    }
    public async ReadStationLine(stationCode:string,lineCode:string):Promise<StationLineDTO>
    {
        try
        {
          let startDate:Date=new Date();   
          let data = await this._contract.evaluateTransaction('ReadStationLine',stationCode,lineCode);
          let endDate:Date=new Date();
          var durationDate:any=endDate.getTime()-startDate.getTime();
          await this._loggerService.LogAsync(LogType.EstimationTime,'StationLine','ReadStationLine',durationDate.toString(),
                                 TransactionType.Read);
          let jsonString:string=prettyJSONString(data.toString()); 
          var jsonObj=JSON.parse(jsonString); 
          var result:StationLineDTO=new StationLineDTO();         
          result.Entity=jsonObj['Entity'];
          result.ID=jsonObj['ID'];
          result.StationCode=jsonObj['StationCode'];
          result.LineCode=jsonObj['LineCode'];
          result.BackwardIndex=jsonObj['BackwardIndex'];
          result.ForwardIndex=jsonObj['ForwardIndex'];
          result.IsDeleted=jsonObj['IsDeleted'];
          return result;
        }
        catch(error){
           await this._loggerService.LogAsync(LogType.Error,'StationLine','ReadStationLine',error.toString(),TransactionType.Read);
           console.log(error);
           var result:StationLineDTO;
           return result;
        }   
    }
    public async GetAllStationsOfLine(lineCode:string):Promise<StationLineDTO[]>
    {
        try
        {
          let startDate:Date=new Date();  
          let data = await this._contract.evaluateTransaction('GetAllStationsOfLine',lineCode);
          let endDate:Date=new Date();
          var durationDate:any=endDate.getTime()-startDate.getTime();
          await this._loggerService.LogAsync(LogType.EstimationTime,'StationLine','GetAllStationsOfLine',durationDate.toString(),
                                 TransactionType.Read);
          let jsonString:string=prettyJSONString(data.toString());  
          var jsonObj=JSON.parse(jsonString);
          var result:StationLineDTO[]=jsonObj;
          return result;
        }
        catch(error){
           await this._loggerService.LogAsync(LogType.Error,'StationLine','GetAllStationsOfLine',error.toString(),TransactionType.Read);
           console.log(error);
           var result:StationLineDTO[];
           return result;
        } 

    }
}