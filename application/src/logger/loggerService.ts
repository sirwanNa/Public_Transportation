import {LoggerDTO,LogType,TransactionType} from './loggerModel';
import { promises as fsPromises } from 'fs';

export class LoggerService{
    private _nodesCount:number=2;
    constructor(nodesCount:number){
      this._nodesCount=nodesCount;
    }
    async LogAsync(l_Type:LogType,entityName:string,functionName:string,content:string,t_Type:TransactionType):Promise<void>{
        let model:LoggerDTO=new LoggerDTO();
        model.Content=content; 
        model.Date=new Date();
        model.EntityName=entityName;
        model.FunctionName=functionName;
        model.L_Type=l_Type;    
        model.T_Type= t_Type;   
        model.NodesCount=this._nodesCount;
        const filePath=await this._createFilePath(model.Date);
        fsPromises.appendFile(filePath, JSON.stringify(model)+'\r\n');
    }
    private async _createFilePath(date:Date):Promise<string>{    
        const directory:string='logFiles'; 
        try 
        {
            await fsPromises.access(directory);
            
        }
        catch {
            fsPromises.mkdir(directory);
        }
        const currentDate:string=`${date.getDate()}_${date.getMonth()}_${date.getFullYear()}`;  
        const filePath:string=`${directory}/log_${currentDate}.txt`;  
        //const filePath:string=`${directory}/log_Performance.txt`;
        return filePath;
    }
}