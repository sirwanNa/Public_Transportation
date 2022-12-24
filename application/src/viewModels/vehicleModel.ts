import {BaseViewModel} from "./baseModel";

export enum VehicleType{
    Bus='Bus',
    Train='Train',
    Ambulance='Ambulance',
    Police ='Police'
}

export class VehicleDTO extends BaseViewModel{ 
    VehicleCode:string;
    Type:VehicleType;
    Factory:string;
    Model:string;
    ConstructionYear:string;  
}