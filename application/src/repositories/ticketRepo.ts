import {TicketDTO,TicketType} from '../viewModels/ticketModel';
import { Contract } from 'fabric-network/lib/contract';
import {prettyJSONString } from '../utils//AppUtil';
import {LogType,TransactionType} from '../logger/loggerModel';
import {LoggerService} from '../logger/loggerService';

export class TicketRepo{
    private _contract:Contract;
    private _loggerService:LoggerService;
    constructor(contract:Contract,nodesCount:number){
        this._contract=contract;
        this._loggerService=new LoggerService(nodesCount);
    }
    async CreateTicket(ticketCode:string,type:TicketType,initiateBalance:number,creator:string,date:string):Promise<boolean>
    {
        try
        {
            let startDate:Date=new Date();
            await this._contract.submitTransaction('CreateTicket',ticketCode,type,initiateBalance.toString(),creator,date);
            let endDate:Date=new Date();
            var durationDate:any=endDate.getTime()-startDate.getTime();
            await this._loggerService.LogAsync(LogType.EstimationTime,'Ticket','CreateTicket',durationDate.toString(),
                                   TransactionType.Write);
            console.log(`Ticket With Initial Balance ${initiateBalance} Has Been Created`);
            return true;
        }
        catch(error){
           await this._loggerService.LogAsync(LogType.Error,'Ticket','CreateTicket',error.toString(),TransactionType.Write);
           console.log(error); 
           return false;
        }
    }
    
    async UpdateTicket(ticketCode:string,type:TicketType,initiateBalance:number,creator:string,date:string,passengerCode:string):Promise<boolean>
    {
        try
        {
            let startDate:Date=new Date();
            await this._contract.submitTransaction('UpdateTicket',ticketCode,type,initiateBalance.toString(),creator,date,passengerCode);
            let endDate:Date=new Date();
            var durationDate:any=endDate.getTime()-startDate.getTime();
            await this._loggerService.LogAsync(LogType.EstimationTime,'Ticket','UpdateTicket',durationDate.toString(),
                                   TransactionType.Write);
            console.log(`Ticket With Initial Balance ${initiateBalance} Has Been Updated`);
            return true;
        }
        catch(error){
           await this._loggerService.LogAsync(LogType.Error,'Ticket','UpdateTicket',error.toString(),TransactionType.Write);
           console.log(error); 
           return false;
        }
    }
    
    async DeleteTicket(ticketCode:string):Promise<boolean>
    {
        try
        {
            let startDate:Date=new Date();
            await this._contract.submitTransaction('DeleteTicket',ticketCode);
            let endDate:Date=new Date();
            var durationDate:any=endDate.getTime()-startDate.getTime();
            await this._loggerService.LogAsync(LogType.EstimationTime,'Ticket','DeleteTicket',durationDate.toString(),
                                   TransactionType.Write);
            console.log(`Ticket ${ticketCode} Has Been Deleted`);
            return true;
        }
        catch(error){
           await this._loggerService.LogAsync(LogType.Error,'Ticket','DeleteTicket',error.toString(),TransactionType.Write);
           console.log(error); 
           return false;
        }
    }

    public async AssignTicket(ticketCode:string,passengerCode:string,date:string):Promise<boolean>
    {
        try
        {
            let startDate:Date=new Date();
            await this._contract.submitTransaction('AssignTicket',ticketCode,passengerCode,date);
            let endDate:Date=new Date();
            var durationDate:any=endDate.getTime()-startDate.getTime();
            await this._loggerService.LogAsync(LogType.EstimationTime,'Ticket','AssignTicket',durationDate.toString(),
                                   TransactionType.Write);
            console.log(`Ticket ${ticketCode} Has Assigned To User ${passengerCode}`);
            return true;
        }
        catch(error){
           await this._loggerService.LogAsync(LogType.Error,'Ticket','AssignTicket',error.toString(),TransactionType.Write);
           console.log(error); 
           return false;
        }
    }
    public async RechargeTicket(ticketCode:string,balance:number,date:string):Promise<boolean>
    {
        try
        {
            let startDate:Date=new Date();
            await this._contract.submitTransaction('RechargeTicket',ticketCode,balance.toString(),date);
            let endDate:Date=new Date();
            var durationDate:any=endDate.getTime()-startDate.getTime();
            await this._loggerService.LogAsync(LogType.EstimationTime,'Ticket','RechargeTicket',durationDate.toString(),
                                   TransactionType.Write);
            console.log(`Total Balance Of Ticket ${ticketCode} Has Been Updated to ${balance}`);
            return true;
        }
        catch(error){
           await this._loggerService.LogAsync(LogType.Error,'Ticket','RechargeTicket',error.toString(),TransactionType.Write);
           console.log(error); 
           return false;
        }
    } 
   
    public async ReadTicket(ticketCode:string):Promise<TicketDTO>
    {
        try
        {
          let startDate:Date=new Date();   
          let data = await this._contract.evaluateTransaction('ReadTicket',ticketCode);
          let endDate:Date=new Date();
          var durationDate:any=endDate.getTime()-startDate.getTime();
          await this._loggerService.LogAsync(LogType.EstimationTime,'Ticket','ReadTicket',durationDate.toString(),
                                 TransactionType.Read);
          let jsonString:string=prettyJSONString(data.toString()); 
          var jsonObj=JSON.parse(jsonString); 
          var result:TicketDTO=new TicketDTO();         
          result.Entity=jsonObj['Entity'];
          result.ID=jsonObj['ID'];
          result.IsDeleted=jsonObj['IsDeleted'];
          result.Balance=jsonObj['Balance'];
          result.Creator=jsonObj['Creator'];
          result.Date=jsonObj['Date'];
          result.TicketCode=jsonObj['TicketCode'];
          result.Type=jsonObj['Type'];
          result.PassengerCode=jsonObj['PassengerCode'];
          return result;
        }
        catch(error){
           await this._loggerService.LogAsync(LogType.Error,'Ticket','ReadTicket',error.toString(),TransactionType.Read);
           console.log(error);
           var result:TicketDTO;
           return result;
        }   
    }

    public async ReadTickesList(fromDate:string='',toDate:string='',creatorCode:string='',passengerCode:string=''):Promise<TicketDTO[]>
    {
        try
        {
          let startDate:Date=new Date();  
          let data = await this._contract.evaluateTransaction('ReadTickesList',fromDate,toDate,creatorCode,passengerCode);
          let endDate:Date=new Date();
          var durationDate:any=endDate.getTime()-startDate.getTime();
          await this._loggerService.LogAsync(LogType.EstimationTime,'Ticket','ReadTickesList',durationDate.toString(),
                                 TransactionType.Read);
          let jsonString:string=prettyJSONString(data.toString());  
          var jsonObj=JSON.parse(jsonString);
          var result:TicketDTO[]=jsonObj;
          return result;
        }
        catch(error){
           await this._loggerService.LogAsync(LogType.Error,'Ticket','ReadTickesList',error.toString(),TransactionType.Read);
           console.log(error);
           var result:TicketDTO[];
           return result;
        }  
    }
}