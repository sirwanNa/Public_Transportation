
export enum LogType{
    EstimationTime=0,
    Error=1,    
}
export enum TransactionType{
  Read=0,
  Write=1
}
export class LoggerDTO{
  //ID:string;
  L_Type:LogType;
  Date:Date;
  Content:string;
  EntityName:string;
  FunctionName:string;
  T_Type:TransactionType;
  NodesCount:number;
}