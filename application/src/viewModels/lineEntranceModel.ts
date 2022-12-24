import { BaseViewModel } from "./baseModel";
import {VehicleType} from './vehicleModel';

export class LineEntranceDTO extends BaseViewModel{
    LineCode:string;
    VehicleType:VehicleType;
    PlaqueNumber:string;
    Type:string;
    Date:string;    
}