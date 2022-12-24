import { BaseViewModel } from "./baseModel";

export enum RepairingServiceType{
    Change='Change',
    Repair='Repair',
    Check='Check'
}

export class RepairingServiceDTO extends BaseViewModel{  
    VehicleCode:string;
    Type:RepairingServiceType;
    Date:string;
    Kilometer:number;
    InstrumentsList:string;
    Repairer:string;
    Desc:string;   
}

