
import {LineEntranceDTO} from '../viewModels/lineEntranceModel';
import { Contract } from 'fabric-network/lib/contract';
import {prettyJSONString } from '../utils/AppUtil';
import {VehicleType} from '../viewModels/vehicleModel';
import {LogType,TransactionType} from '../logger/loggerModel';
import {LoggerService} from '../logger/loggerService';
import {ILineEntranceRepo} from '../irepositories/ilineEntranceRepo';

export class LineEntranceRepo implements ILineEntranceRepo{
    private _contract:Contract;
    private _loggerService:LoggerService;
    constructor(contract:Contract,nodesCount:number){
        this._contract=contract;
        this._loggerService=new LoggerService(nodesCount);
    }
    public async ComeIn(lineCode:string,vehicleType:VehicleType,plaqueNumber:string,date:string):Promise<boolean>
    {
        try
        {
            let startDate:Date=new Date();  
            await this._contract.submitTransaction('ComeIn',lineCode,vehicleType,plaqueNumber,date);
            let endDate:Date=new Date();
            var durationDate:any=endDate.getTime()-startDate.getTime();
            await this._loggerService.LogAsync(LogType.EstimationTime,'LineEntrance','ComeIn',durationDate.toString(),
                                   TransactionType.Write);
            console.log(`New Vehicle with ${plaqueNumber} plaque came in to line ${lineCode}`);
            return true;
        }
        catch(error){
           await this._loggerService.LogAsync(LogType.Error,'LineEntrance','ComeIn',error.toString(),TransactionType.Write);
           console.log(error); 
           return false;
        }
    }
    public async ComeOut(lineCode:string,vehicleType:VehicleType,plaqueNumber:string,date:string):Promise<boolean>
    {
        try
        {
            let startDate:Date=new Date();  
            await this._contract.submitTransaction('ComeOut',lineCode,vehicleType,plaqueNumber,date);
            let endDate:Date=new Date();
            var durationDate:any=endDate.getTime()-startDate.getTime();
            await this._loggerService.LogAsync(LogType.EstimationTime,'LineEntrance','ComeOut',durationDate.toString(),
                                   TransactionType.Write);
            console.log(`The Vehicle with ${plaqueNumber} plaque came out from line ${lineCode}`);
            return true;
        }
        catch(error){
           await this._loggerService.LogAsync(LogType.Error,'LineEntrance','ComeOut',error.toString(),TransactionType.Write);
           console.log(error); 
           return false;
        }
    }

    public async ReadUsingHistory(lineCode:string,vehicleType?:VehicleType,fromDate:string='',toDate:string=''):Promise<LineEntranceDTO[]>
    {
        try
        {
          let startDate:Date=new Date();  
          const vehicleTypeFilterValue:string=  vehicleType != null ? vehicleType:'';
          let data = await this._contract.evaluateTransaction('ReadUsingHistory',lineCode,vehicleTypeFilterValue,fromDate,toDate);
          let endDate:Date=new Date();
          var durationDate:any=endDate.getTime()-startDate.getTime();
          await this._loggerService.LogAsync(LogType.EstimationTime,'LineEntrance','ReadUsingHistory',durationDate.toString(),
                                 TransactionType.Read);
          let jsonString:string=prettyJSONString(data.toString());  
          var jsonObj=JSON.parse(jsonString);
          var result:LineEntranceDTO[]=jsonObj;
          return result;
        }
        catch(error){
           await this._loggerService.LogAsync(LogType.Error,'LineEntrance','ReadUsingHistory',error.toString(),TransactionType.Read);
           console.log(error);
           var result:LineEntranceDTO[];
           return result;
        }  
    }
}