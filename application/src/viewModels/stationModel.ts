import { BaseViewModel } from "./baseModel";

export enum StationType{
    BRT='BRT',
    Bus='Bus',
    SubWay='SubWay',
    Train='Train'
}

export class StationDTO extends BaseViewModel{    
    StationCode:string;
    Name:string;
    Type:StationType;
    Address:string;
    GPSLocation:string;    
}