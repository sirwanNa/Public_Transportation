import {StationDTO,StationType} from '../viewModels/stationModel';
import { Contract } from 'fabric-network/lib/contract';
import {prettyJSONString } from '../utils//AppUtil';
import {LogType,TransactionType} from '../logger/loggerModel';
import {LoggerService} from '../logger/loggerService';
import {IStationRepo} from '../irepositories/istationRepo'

export class StationRepo implements IStationRepo{
    private _contract:Contract;
    private _loggerService:LoggerService;
    constructor(contract:Contract,nodesCount:number){
        this._contract=contract;
        this._loggerService=new LoggerService(nodesCount);
    }
    public async CreateStation(stationCode:string,name:string,type:StationType,address:string,gpsLocation:string):Promise<boolean>
    {
        try
        {
            let startDate:Date=new Date();
            await this._contract.submitTransaction('CreateStation',stationCode,name,type,address,gpsLocation);
            let endDate:Date=new Date();
            var durationDate:any=endDate.getTime()-startDate.getTime();
            await this._loggerService.LogAsync(LogType.EstimationTime,'Station','CreateStation',durationDate.toString(),
                                   TransactionType.Write);
            console.log(`Station (${name}) Has Been Created`);
            return true;
        }
        catch(error){
           await this._loggerService.LogAsync(LogType.Error,'Station','CreateStation',error.toString(),TransactionType.Write);
           console.log(error); 
           return false;
        }
    }

    public async UpdateStation(stationCode:string,name:string,type:StationType,address:string,gpsLocation:string):Promise<boolean>
    {
        try
        {
            let startDate:Date=new Date();
            await this._contract.submitTransaction('UpdateStation',stationCode,name,type,address,gpsLocation);
            let endDate:Date=new Date();
            var durationDate:any=endDate.getTime()-startDate.getTime();
            await this._loggerService.LogAsync(LogType.EstimationTime,'Station','UpdateStation',durationDate.toString(),
                                   TransactionType.Write);
            console.log(`Station ${stationCode} Has Been Updated`);
            return true;
        }
        catch(error){
           await this._loggerService.LogAsync(LogType.Error,'Station','UpdateStation',error.toString(),TransactionType.Write); 
           console.log(error); 
           return false;
        }
    }
    public async DeleteStation(stationCode:string):Promise<boolean>
    {
        try
        {
            let startDate:Date=new Date();
            await this._contract.submitTransaction('DeleteStation',stationCode);  
            let endDate:Date=new Date();
            var durationDate:any=endDate.getTime()-startDate.getTime();
           await this._loggerService.LogAsync(LogType.EstimationTime,'Station','DeleteStation',durationDate.toString(),
                                   TransactionType.Write);
            console.log(`Station ${stationCode} Has Been Deactived`);
            return true;
        }
        catch(error){
           await this._loggerService.LogAsync(LogType.Error,'Station','DeleteStation',error.toString(),TransactionType.Write); 
           console.log(error); 
           return false;
        }
    }
    public async ReadStation(stationCode:string):Promise<StationDTO>
    {
        try
        {
          let startDate:Date=new Date();   
          let data = await this._contract.evaluateTransaction('ReadStation',stationCode);
          let endDate:Date=new Date();
          var durationDate:any=endDate.getTime()-startDate.getTime();
          await this._loggerService.LogAsync(LogType.EstimationTime,'Station','ReadStation',durationDate.toString(),
                                 TransactionType.Read);
          let jsonString:string=prettyJSONString(data.toString()); 
          var jsonObj=JSON.parse(jsonString); 
          var result:StationDTO=new StationDTO();         
          result.Entity=jsonObj['Entity'];
          result.ID=jsonObj['ID'];
          result.Address=jsonObj['Address'];
          result.GPSLocation=jsonObj['GPSLocation'];
          result.Name=jsonObj['Name'];
          result.StationCode=jsonObj['StationCode'];
          result.Type=jsonObj['Type'];
          result.IsDeleted=jsonObj['IsDeleted'];
          return result;
        }
        catch(error){
           await this._loggerService.LogAsync(LogType.Error,'Station','ReadStation',error.toString(),TransactionType.Read);
           console.log(error);
           var result:StationDTO;
           return result;
        }   
    }
    public async GetAllStations(name:string='',stationCode:string='',type?:StationType):Promise<StationDTO[]>
    {
        try
        {
          let startDate:Date=new Date();     
          const stationTypeFilterValue= type != null? type:''; 
          let data = await this._contract.evaluateTransaction('GetAllStations',name,stationCode,stationTypeFilterValue);
          let endDate:Date=new Date();
          var durationDate:any=endDate.getTime()-startDate.getTime();
          await this._loggerService.LogAsync(LogType.EstimationTime,'Station','GetAllStations',durationDate.toString(),
                                 TransactionType.Read);
          let jsonString:string=prettyJSONString(data.toString());  
          var jsonObj=JSON.parse(jsonString);
          var result:StationDTO[]=jsonObj;
          return result;
        }
        catch(error){
           await this._loggerService.LogAsync(LogType.Error,'Station','GetAllStations',error.toString(),TransactionType.Read);
           console.log(error);
           var result:StationDTO[];
           return result;
        } 
    }
}