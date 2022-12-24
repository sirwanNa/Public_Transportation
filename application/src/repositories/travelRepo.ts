import {TravelDTO} from '../viewModels/travelModel';
import { Contract } from 'fabric-network/lib/contract';
import {prettyJSONString } from '../utils//AppUtil';
import {LogType,TransactionType} from '../logger/loggerModel';
import {LoggerService} from '../logger/loggerService';
import {ITravelRepo} from '../irepositories/itravelRepo'

export class TravelRepo implements ITravelRepo{
    private _contract:Contract;
    private _loggerService:LoggerService;
    constructor(contract:Contract,nodesCount:number){
        this._contract=contract;
        this._loggerService=new LoggerService(nodesCount);
    }
    public async AddTransaction(ticketCode:string,stationCode:string,date:string):Promise<boolean>
    {
        try
        {
            let startDate:Date=new Date();
            const type=await this._contract.submitTransaction('AddTransaction',ticketCode,stationCode,date);
            let endDate:Date=new Date();
            var durationDate:any=endDate.getTime()-startDate.getTime();
            await this._loggerService.LogAsync(LogType.EstimationTime,'Travel','AddTransaction',durationDate.toString(),
                                   TransactionType.Write);
            if(type.toString() == 'Input'){
                console.log(`Passenger With Ticket ${ticketCode} Came In To Station ${stationCode} In ${date}`);
            }
            else{
                console.log(`Passenger With Ticket ${ticketCode} Came Out From Station ${stationCode} In ${date}`);
            }            
            return true;
        }
        catch(error){
           await this._loggerService.LogAsync(LogType.Error,'Travel','AddTransaction',error.toString(),TransactionType.Write);
           console.log(error); 
           return false;
        }
    }

    public async FindTravelHistory(ticketCode:string):Promise<TravelDTO[]>
    {
        try
        {
          let startDate:Date=new Date();  
          let data = await this._contract.evaluateTransaction('FindTravelHistory',ticketCode);
          let endDate:Date=new Date();
          var durationDate:any=endDate.getTime()-startDate.getTime();
          await this._loggerService.LogAsync(LogType.EstimationTime,'Travel','FindTravelHistory',durationDate.toString(),
                                 TransactionType.Read);
          let jsonString:string=prettyJSONString(data.toString());  
          var jsonObj=JSON.parse(jsonString);
          var result:TravelDTO[]=jsonObj;
          return result;
        }
        catch(error){
           await this._loggerService.LogAsync(LogType.Error,'Travel','FindTravelHistory',error.toString(),TransactionType.Read);
           console.log(error);
           var result:TravelDTO[];
           return result;
        } 
    }

}