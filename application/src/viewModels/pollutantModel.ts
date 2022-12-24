import { BaseViewModel } from "./baseModel";
export class AirPollutantDTO extends BaseViewModel{  
    public StationCode:string;
    public Date:string;
    public Co2:number;
    public Co:number;
    public So2:number;
    public No2:number;
    public O3:number;
    public Humidity:number; 
}

export class NoisePollutantDTO extends BaseViewModel{   
    StationCode:string;
    Date:string;
    L10:number;
    L50:number;
    L95:number;
    L99:number;
    LEQ:number;
    SEL:number;
    SPL:number;
    L_Min:number;
    L_Max:number;   
}
