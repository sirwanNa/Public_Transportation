import { BaseViewModel } from "./baseModel";
export class MoveToStationDTO extends BaseViewModel{   
    StationLineId:string;
    VehicleCode:string;
    Type:string;
    Date:string;
    Round:Number;
    Direction:number;   
}

export class MoveToStationTranformation{
    InputId:string;
    OutputId:string;
    StationLineId:string;   
    VehicleCode:string;
    InputDate:string;
    OutputDate:string;
    Direction:number;
}