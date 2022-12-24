import {AirPollutantDTO,NoisePollutantDTO} from '../viewModels/pollutantModel';
import {Contract} from 'fabric-network/lib/contract';
import {prettyJSONString } from '../utils/AppUtil';
import {LogType,TransactionType} from '../logger/loggerModel';
import {LoggerService} from '../logger/loggerService'
import {IPollutantRepo} from '../irepositories/ipollutantRepo'

export class PollutantRepo implements IPollutantRepo{
    private _contract:Contract;    
    private _loggerService:LoggerService;
    constructor(contract:Contract,nodesCount:number){
        this._contract=contract;
        this._loggerService=new LoggerService(nodesCount);
    }
    public async InsertAirData(stationCode:string,date:string,co2:number,
                 co:number,so2:number,no2:number,o3:number,humidity:number):Promise<boolean>
    {
            try
            {
                let startDate:Date=new Date();  
                await this._contract.submitTransaction('InsertAirData',stationCode,date,co2.toString(),
                        co.toString(),so2.toString(),no2.toString(),o3.toString(),humidity.toString());
                let endDate:Date=new Date();
                var durationDate:any=endDate.getTime()-startDate.getTime();
                await this._loggerService.LogAsync(LogType.EstimationTime,'Pollutant','InsertAirData',durationDate.toString(),
                                        TransactionType.Write);
                console.log('New Air Pollutant Data Has Been Inserted');
                return true;
            }
            catch(error){
               await this._loggerService.LogAsync(LogType.Error,'Pollutant','InsertAirData',error.toString(),TransactionType.Write);
               console.log(error); 
               return false;
            }
    }
    
    public async InsertNoiseData(stationCode:string,date:string,l10:number,l50:number,l95:number,
                 l99:number,leq:number,sel:number,spl:number,l_min:number,l_max:number):Promise<boolean>
    {
        
            try
            {
               let startDate:Date=new Date();  
                await this._contract.submitTransaction('InsertNoiseData',stationCode,date,l10.toString(),
                                l50.toString(),l95.toString(),l99.toString(),leq.toString(),
                                sel.toString(),spl.toString(),l_min.toString(),l_max.toString());
                                let endDate:Date=new Date();
                var durationDate:any=endDate.getTime()-startDate.getTime();
                await this._loggerService.LogAsync(LogType.EstimationTime,'Pollutant','InsertAirData',durationDate.toString(),
                                        TransactionType.Write);                
                console.log('New Noise Pollutant Data Has Been Inserted');                
                return true;
            }
            catch(error){
               await this._loggerService.LogAsync(LogType.Error,'Pollutant','InsertNoiseData',error.toString(),TransactionType.Write);
               console.log(error);
               return false;
            } 
    }
    public async ReadAirPollutionHistory(stationCode:string,fromDate:string='',toDate:string=''):Promise<AirPollutantDTO[]>
    {      
      try
      {
        let startDate:Date=new Date(); 
        let data = await this._contract.evaluateTransaction('ReadPollutionHistory',stationCode,'air',fromDate,toDate);
        let endDate:Date=new Date();
        var durationDate:any=endDate.getTime()-startDate.getTime();
        await this._loggerService.LogAsync(LogType.EstimationTime,'Pollutant','ReadAirPollutionHistory',durationDate.toString(),
                               TransactionType.Read);
        let jsonString:string=prettyJSONString(data.toString());  
        var jsonObj=JSON.parse(jsonString);
        var result:AirPollutantDTO[]=jsonObj;
        return result;
      }
      catch(error){
         await this._loggerService.LogAsync(LogType.Error,'Pollutant','ReadAirPollutionHistory',error.toString(),TransactionType.Read);
         console.log(error);
         var result:AirPollutantDTO[];
         return result;
      }      
    }

    public async ReadNoisePollutionHistory(stationCode:string,fromDate:string='',toDate:string=''):Promise<NoisePollutantDTO[]>
    {
        try
        {
          let startDate:Date=new Date();  
          let data = await this._contract.evaluateTransaction('ReadPollutionHistory',stationCode,'noise',fromDate,toDate);
          let endDate:Date=new Date();
          var durationDate:any=endDate.getTime()-startDate.getTime();
          await this._loggerService.LogAsync(LogType.EstimationTime,'Pollutant','ReadNoisePollutionHistory',durationDate.toString(),
                                 TransactionType.Read);
          let jsonString:string=prettyJSONString(data.toString());  
          var jsonObj=JSON.parse(jsonString);
          var result:NoisePollutantDTO[]=jsonObj;
          return result;
        }
        catch(error){
           await this._loggerService.LogAsync(LogType.Error,'Pollutant','ReadNoisePollutionHistory',error.toString(),TransactionType.Read);
           console.log(error);
           var result:NoisePollutantDTO[];
           return result;
        } 
    }
}