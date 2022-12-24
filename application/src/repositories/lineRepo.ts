import {LineDTO} from '../viewModels/lineModel';
import { Contract } from 'fabric-network/lib/contract';
import {prettyJSONString } from '../utils//AppUtil';
import {LogType,TransactionType} from '../logger/loggerModel';
import {LoggerService} from '../logger/loggerService';
import {ILineRepo} from '../irepositories/ilineRepo'

export class LineRepo implements ILineRepo{
    private _contract:Contract;
    private _loggerService:LoggerService;
    constructor(contract:Contract,nodesCount:number){
        this._contract=contract;
        this._loggerService=new LoggerService(nodesCount);
    }
    public async CreateLine(title:string,lineCode:string,startPosition:string,endPosition:string,desc:string):Promise<boolean>
    {
        try
        {    
            let startDate:Date=new Date();       
            await this._contract.submitTransaction('CreateLine',title,lineCode,startPosition,endPosition,desc);
            let endDate:Date=new Date();
            var durationDate:any=endDate.getTime()-startDate.getTime();
            await this._loggerService.LogAsync(LogType.EstimationTime,'Line','CreateLine',durationDate.toString(),
                                   TransactionType.Write);
            console.log(`Line (${title}) Has Been Created`);
            return true;
        }
        catch(error){
           await this._loggerService.LogAsync(LogType.Error,'Line','CreateLine',error.toString(),TransactionType.Write);
           console.log(error); 
           return false;
        }
    } 

    public  async UpdateLine(title:string,lineCode:string,startPosition:string,endPosition:string,desc:string):Promise<boolean>
    {
        try
        {
            let startDate:Date=new Date();
            await this._contract.submitTransaction('UpdateLine',title,lineCode,startPosition,endPosition,desc);
            let endDate:Date=new Date();
            var durationDate:any=endDate.getTime()-startDate.getTime();
            await this._loggerService.LogAsync(LogType.EstimationTime,'Line','UpdateLine',durationDate.toString(),TransactionType.Write);
            console.log(`Line ${lineCode} Has Been Created`);
            return true;
        }
        catch(error){
           await this._loggerService.LogAsync(LogType.Error,'Line','UpdateLine',error.toString(),TransactionType.Write);
           console.log(error); 
           return false;
        }
    } 

    async DeleteLine(lineCode:string):Promise<boolean> {
        try
        {
            let startDate:Date=new Date();
            await this._contract.submitTransaction('DeleteLine',lineCode);
            let endDate:Date=new Date();
            var durationDate:any=endDate.getTime()-startDate.getTime();
            await this._loggerService.LogAsync(LogType.EstimationTime,'Line','DeleteLine',durationDate.toString(),
                                   TransactionType.Write);
            console.log(`Line ${lineCode} Has Been Deactived`);
            return true;
        }
        catch(error){
           await this._loggerService.LogAsync(LogType.Error,'Line','DeleteLine',error.toString(),TransactionType.Write);
           console.log(error); 
           return false;
        }
    }      
   

    async ReadLine(lineCode:string):Promise<LineDTO>
    {
        try
        {
          let startDate:Date=new Date();  
          let data = await this._contract.evaluateTransaction('ReadLine',lineCode);
          let endDate:Date=new Date();
          var durationDate:any=endDate.getTime()-startDate.getTime();
          await this._loggerService.LogAsync(LogType.EstimationTime,'Line','ReadLine',durationDate.toString(),
                                 TransactionType.Read);
          let jsonString:string=prettyJSONString(data.toString()); 
          var jsonObj=JSON.parse(jsonString); 
          var result:LineDTO=new LineDTO();          
          result.Entity=jsonObj['Entity'];          
          result.ID=jsonObj['ID'];
          result.Desc=jsonObj['Desc'];
          result.EndPosition=jsonObj['EndPosition'];
          result.LineCode=jsonObj['LineCode'];
          result.StartPosition=jsonObj['StartPosition'];
          result.Title=jsonObj['Title'];
          result.IsDeleted=jsonObj['IsDeleted'];
          return result;
        }
        catch(error){
           await this._loggerService.LogAsync(LogType.Error,'Line','ReadLine',error.toString(),TransactionType.Read);
           console.log(error);
           var result:LineDTO;
           return result;
        } 
    }
    public async ReadAllLines(title:string='',lineCode:string=''):Promise<LineDTO[]>
    {
        try
        {
          let startDate:Date=new Date();  
          let data = await this._contract.evaluateTransaction('GetAllLines',title,lineCode);
          let endDate:Date=new Date();
          var durationDate:any=endDate.getTime()-startDate.getTime();
          await this._loggerService.LogAsync(LogType.EstimationTime,'Line','ReadAllLines',durationDate.toString(),
                                 TransactionType.Read);
          let jsonString:string=prettyJSONString(data.toString());  
          var jsonObj=JSON.parse(jsonString);
          var result:LineDTO[]=jsonObj;
          return result;
        }
        catch(error){
           await this._loggerService.LogAsync(LogType.Error,'Line','ReadAllLines',error.toString(),TransactionType.Read);
           console.log(error);
           var result:LineDTO[];
           return result;
        }    
    }
}