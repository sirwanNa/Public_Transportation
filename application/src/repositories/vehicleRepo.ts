import {VehicleDTO,VehicleType} from '../viewModels/vehicleModel';
import { Contract } from 'fabric-network/lib/contract';
import {prettyJSONString } from '../utils//AppUtil';
import {LogType,TransactionType} from '../logger/loggerModel';
import {LoggerService} from '../logger/loggerService';
import {IVehicleRepo} from '../irepositories/ivehicleRepo'

export class VehicleRepo implements IVehicleRepo{
    private _contract:Contract;
    private _loggerService:LoggerService;
    constructor(contract:Contract,nodesCount:number){
        this._contract=contract;
        this._loggerService=new LoggerService(nodesCount);
    }
    public async CreateVehicle(vehicleCode:string,type:VehicleType,factory:string,
                model:string,constructionYear:string):Promise<boolean>
    {
        try
        {
            let startDate:Date=new Date();
            await this._contract.submitTransaction('CreateVehicle',vehicleCode,type,factory,model,constructionYear);
            let endDate:Date=new Date();
            var durationDate:any=endDate.getTime()-startDate.getTime();
            await this._loggerService.LogAsync(LogType.EstimationTime,'Vehicle','CreateVehicle',durationDate.toString(),
                                   TransactionType.Write);
            console.log('New Vehicle Has Been Created');
            return true;
        }
        catch(error){
           await this._loggerService.LogAsync(LogType.Error,'Vehicle','CreateVehicle',error.toString(),TransactionType.Write);
           console.log(error); 
           return false;
        }
    }

    public async UpdateVehicle(vehicleCode:string,type:VehicleType,factory:string,
                model:string,constructionYear:string):Promise<boolean>
    {
        try
        {
            let startDate:Date=new Date();
            await this._contract.submitTransaction('UpdateVehicle',vehicleCode,type,factory,model,constructionYear);
            let endDate:Date=new Date();
            var durationDate:any=endDate.getTime()-startDate.getTime();
            await this._loggerService.LogAsync(LogType.EstimationTime,'Vehicle','UpdateVehicle',durationDate.toString(),
                                   TransactionType.Write);
            console.log(`Vehicle ${vehicleCode} Has Been Updated`);
            return true;
        }
        catch(error){
           await this._loggerService.LogAsync(LogType.Error,'Vehicle','UpdateVehicle',error.toString(),TransactionType.Write);
           console.log(error); 
           return false;
        }
    }
    public async DeleteVehicle(vehicleCode:string):Promise<boolean>
    {
        try
        {
            let startDate:Date=new Date();
            await this._contract.submitTransaction('DeleteVehicle',vehicleCode);
            let endDate:Date=new Date();
            var durationDate:any=endDate.getTime()-startDate.getTime();
            await this._loggerService.LogAsync(LogType.EstimationTime,'Vehicle','DeleteVehicle',durationDate.toString(),
                                   TransactionType.Write);
            console.log(`Vehicle ${vehicleCode} Has Been Deactived`);
            return true;
        }
        catch(error){
           await this._loggerService.LogAsync(LogType.Error,'Vehicle','DeleteVehicle',error.toString(),TransactionType.Write);
           console.log(error); 
           return false;
        }
    }
    async ReadVehicle(vehicleCode:string):Promise<VehicleDTO>
    {
        try
        {
          let startDate:Date=new Date();   
          let data = await this._contract.evaluateTransaction('ReadVehicle',vehicleCode);
          let endDate:Date=new Date();
          var durationDate:any=endDate.getTime()-startDate.getTime();
          await this._loggerService.LogAsync(LogType.EstimationTime,'Vehicle','ReadVehicle',durationDate.toString(),
                                 TransactionType.Read);
          let jsonString:string=prettyJSONString(data.toString()); 
          var jsonObj=JSON.parse(jsonString); 
          var result:VehicleDTO=new VehicleDTO();          
          result.ConstructionYear=jsonObj['ConstructionYear'];
          result.Entity=jsonObj['Entity'];
          result.Factory=jsonObj['Factory'];
          result.ID=jsonObj['ID'];
          result.Model=jsonObj['Model'];
          result.Type=jsonObj['Type'];
          return result;
        }
        catch(error){
           await this._loggerService.LogAsync(LogType.Error,'Vehicle','ReadVehicle',error.toString(),TransactionType.Read);
           console.log(error);
           var result:VehicleDTO;
           return result;
        }     
    }
    async GetAllVehicles(type?:VehicleType,factory:string='',model:string=''):Promise<VehicleDTO[]>
    {
        try
        {
          let startDate:Date=new Date();  
          const typeFilterValue=type != null?type:'';  
          let data = await this._contract.evaluateTransaction('GetAllVehicles',typeFilterValue,factory,model);
          let endDate:Date=new Date();
          var durationDate:any=endDate.getTime()-startDate.getTime();
          await this._loggerService.LogAsync(LogType.EstimationTime,'Vehicle','GetAllVehicles',durationDate.toString(),
                                 TransactionType.Read);
          let jsonString:string=prettyJSONString(data.toString());  
          var jsonObj=JSON.parse(jsonString);
          var result:VehicleDTO[]=jsonObj;
          return result;
        }
        catch(error){
           await this._loggerService.LogAsync(LogType.Error,'Vehicle','GetAllVehicles',error.toString(),TransactionType.Read);
           console.log(error);
           var result:VehicleDTO[];
           return result;
        }  
    }
}