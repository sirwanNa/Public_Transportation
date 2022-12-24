import {RepairingServiceDTO,RepairingServiceType} from '../viewModels/repairingServiceModel';
import { Contract } from 'fabric-network/lib/contract';
import {prettyJSONString } from '../utils//AppUtil';
import {LogType,TransactionType} from '../logger/loggerModel';
import {LoggerService} from '../logger/loggerService';
import {IRepairingServiceRepo} from '../irepositories/irepairingServiceRepo';

export class RepairingServiceRepo implements IRepairingServiceRepo{
    private _contract:Contract;
    private _loggerService:LoggerService;
    constructor(contract:Contract,nodesCount:number){
        this._contract=contract;
        this._loggerService=new LoggerService(nodesCount);
    }
    public async CreateService(vehicleCode:string,type:RepairingServiceType,date:string,kilometer:number,
                instrumentsList:string,repairer:string,desc:string=''):Promise<boolean>
    {
        try
        {
            let startDate:Date=new Date();
            await this._contract.submitTransaction('CreateService',vehicleCode,type,date,kilometer.toString(),instrumentsList,repairer,desc);
            let endDate:Date=new Date();
            var durationDate:any=endDate.getTime()-startDate.getTime();
            await this._loggerService.LogAsync(LogType.EstimationTime,'RepairingService','CreateService',durationDate.toString(),
                                   TransactionType.Write);
            console.log(`New Repairing Service for  vehicle ${vehicleCode} Has Been Created`);
            return true;
        }
        catch(error){
           await this._loggerService.LogAsync(LogType.Error,'RepairingService','CreateService',error.toString(),TransactionType.Write);
           console.log(error); 
           return false;
        }
    }

    public async ReadRepairingHistory(vehicleCode:string,type?:RepairingServiceType,fromDate:string='',toDate:string='',repairer:string='')
                :Promise<RepairingServiceDTO[]>
    {
        try
        {      
          let startDate:Date=new Date();   
          let typeFilterValue:string=type?type:'';     
          let data = await this._contract.evaluateTransaction('ReadRepairingHistory',vehicleCode,typeFilterValue,fromDate,toDate,repairer);
          let endDate:Date=new Date();
          var durationDate:any=endDate.getTime()-startDate.getTime();
          await this._loggerService.LogAsync(LogType.EstimationTime,'RepairingService','ReadRepairingHistory',durationDate.toString(),
                                 TransactionType.Read);
          let jsonString:string=prettyJSONString(data.toString());  
          var jsonObj=JSON.parse(jsonString);
          var result:RepairingServiceDTO[]=jsonObj;
          return result;
        }
        catch(error){
           await this._loggerService.LogAsync(LogType.Error,'RepairingService','ReadRepairingHistory',error.toString(),TransactionType.Read);
           console.log(error);
           var result:RepairingServiceDTO[];
           return result;
        }  
    } 

    public async FindNextNecessaryServices(year:number,month:number):Promise<RepairingServiceDTO[]>
    {
        try
        {
          let startDate:Date=new Date();  
          let data = await this._contract.evaluateTransaction('FindNextNecessaryServices',year.toString(),month.toString());
          let endDate:Date=new Date();
          var durationDate:any=endDate.getTime()-startDate.getTime();
          await this._loggerService.LogAsync(LogType.EstimationTime,'RepairingService','FindNextNecessaryServices',durationDate.toString(),
                                 TransactionType.Read);
          let jsonString:string=prettyJSONString(data.toString());  
          var jsonObj=JSON.parse(jsonString);       
          var result:RepairingServiceDTO[]=jsonObj;          
          return result;
        }
        catch(error){
           await this._loggerService.LogAsync(LogType.Error,'RepairingService','FindNextNecessaryServices',error.toString(),TransactionType.Read);
           console.log(error);
           var result:RepairingServiceDTO[];
           return result;
        }  
    }
}