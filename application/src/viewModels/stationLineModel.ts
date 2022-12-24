import { BaseViewModel } from "./baseModel";

export class StationLineDTO extends BaseViewModel{  
    StationCode:string;
    LineCode:string;
    ForwardIndex:number;
    BackwardIndex:number;   
}