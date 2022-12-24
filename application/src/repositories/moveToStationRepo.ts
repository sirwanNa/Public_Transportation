import {MoveToStationDTO} from '../viewModels/moveToStationModel';
import { Contract } from 'fabric-network/lib/contract';
import {prettyJSONString } from '../utils//AppUtil';
import {LogType,TransactionType} from '../logger/loggerModel';
import {LoggerService} from '../logger/loggerService';
import {IMoveToStationRepo} from '../irepositories/imoveToStationRepo';

export class MoveToStationRepo implements IMoveToStationRepo{
    private _contract:Contract;
    private _loggerService:LoggerService;
    constructor(contract:Contract,nodesCount:number){
        this._contract=contract;
        this._loggerService=new LoggerService(nodesCount);
    }
    public async Input(stationCode:string,lineCode:string,vehicleCode:string,date:string,direction:number):Promise<boolean>
    {
        try
        {
            let startDate:Date=new Date();
            await this._contract.submitTransaction('Input',stationCode,lineCode,vehicleCode,date,direction.toString());
            let endDate:Date=new Date();
            var durationDate:any=endDate.getTime()-startDate.getTime();
            await this._loggerService.LogAsync(LogType.EstimationTime,'MoveToStation','Input',durationDate.toString(),
                                   TransactionType.Write);
            console.log(`Vehicle ${vehicleCode} Came in to Station ${stationCode} of ${lineCode}`);
            return true;
        }
        catch(error){
           await this._loggerService.LogAsync(LogType.Error,'MoveToStation','Input',error.toString(),TransactionType.Write);
           console.log(error); 
           return false;
        }
    }
    public async Input_V2(id:string,stationLineId:string,vehicleCode:string,date:string,direction:number):Promise<boolean>
    {
        try
        {
            let startDate:Date=new Date();
            await this._contract.submitTransaction('Input_V2',id,stationLineId,vehicleCode,date,direction.toString());
            let endDate:Date=new Date();
            var durationDate:any=endDate.getTime()-startDate.getTime();
            await this._loggerService.LogAsync(LogType.EstimationTime,'MoveToStation','Input',durationDate.toString(),
                                   TransactionType.Write);
            console.log(`Vehicle ${vehicleCode} Came in to Station Line Id ${stationLineId}`);
            return true;
        }
        catch(error){
           await this._loggerService.LogAsync(LogType.Error,'MoveToStation','Input',error.toString(),TransactionType.Write);
           console.log(error); 
           return false;
        }
    }

    public async Output(stationCode:string,lineCode:string,vehicleCode:string,date:string,direction:number):Promise<boolean>
    {
        try
        {
            let startDate:Date=new Date();
            await this._contract.submitTransaction('Output',stationCode,lineCode,vehicleCode,date,direction.toString());
            let endDate:Date=new Date();
            var durationDate:any=endDate.getTime()-startDate.getTime();
            await this._loggerService.LogAsync(LogType.EstimationTime,'MoveToStation','Output',durationDate.toString(),
                                   TransactionType.Write);
            console.log(`Vehicle ${vehicleCode} Came out from Station ${stationCode} of ${lineCode}`);
            return true;
        }
        catch(error){
           await this._loggerService.LogAsync(LogType.Error,'MoveToStation','Output',error.toString(),TransactionType.Write);
           console.log(error); 
           return false;
        }
    }
    public async Output_V2(id:string,stationLineId:string,vehicleCode:string,date:string,direction:number):Promise<boolean>
    {
        try
        {
            let startDate:Date=new Date();
            await this._contract.submitTransaction('Output_V2',id,stationLineId,vehicleCode,date,direction.toString());
            let endDate:Date=new Date();
            var durationDate:any=endDate.getTime()-startDate.getTime();
            await this._loggerService.LogAsync(LogType.EstimationTime,'MoveToStation','Output',durationDate.toString(),
                                   TransactionType.Write);
            console.log(`Vehicle ${vehicleCode} Came out from Station Line Id ${stationLineId}`);
            return true;
        }
        catch(error){
           await this._loggerService.LogAsync(LogType.Error,'MoveToStation','Output',error.toString(),TransactionType.Write);
           console.log(error); 
           return false;
        }
    }
    public async FindComingVehicles(stationCode:string):Promise<MoveToStationDTO[]>
    {
        try
        {
          let startDate:Date=new Date();
          let data = await this._contract.evaluateTransaction('FindComingVehicles',stationCode);
          let endDate:Date=new Date();
          var durationDate:any=endDate.getTime()-startDate.getTime();
          await this._loggerService.LogAsync(LogType.EstimationTime,'MoveToStation','FindComingVehicles',durationDate.toString(),
                                 TransactionType.Read);
          let jsonString:string=prettyJSONString(data.toString());  
          var jsonObj=JSON.parse(jsonString);
          var result:MoveToStationDTO[]=jsonObj;
          return result;
        }
        catch(error){
           await this._loggerService.LogAsync(LogType.Error,'MoveToStation','FindComingVehicles',error.toString(),TransactionType.Read);
           console.log(error);
           var result:MoveToStationDTO[];
           return result;
        }  
    }
    public async ReadHistoryOfMovement(lineCode:string,stationCode:string,direction?:number,fromDate:string='',toDate:string=''):Promise<MoveToStationDTO[]>
    {
        try
        {
          let startDate:Date=new Date();
          const directionValue=direction?direction.toString():'';
          let data = await this._contract.evaluateTransaction('ReadHistoryOfMovement',lineCode,stationCode,directionValue,fromDate,toDate);
          let endDate:Date=new Date();
          var durationDate:any=endDate.getTime()-startDate.getTime();
          await this._loggerService.LogAsync(LogType.EstimationTime,'MoveToStation','ReadHistoryOfMovement',durationDate.toString(),
                                 TransactionType.Write);
          let jsonString:string=prettyJSONString(data.toString());  
          var jsonObj=JSON.parse(jsonString);
          var result:MoveToStationDTO[]=jsonObj;
          return result;
        }
        catch(error){
           await this._loggerService.LogAsync(LogType.Error,'MoveToStation','ReadHistoryOfMovement',error.toString(),TransactionType.Read);
           console.log(error);
           var result:MoveToStationDTO[];
           return result;
        }  
    }
}