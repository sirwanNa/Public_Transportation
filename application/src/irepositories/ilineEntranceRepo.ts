import {VehicleType} from '../viewModels/vehicleModel';
import {LineEntranceDTO} from '../viewModels/lineEntranceModel';

export interface ILineEntranceRepo{

   ComeIn(lineCode:string,vehicleType:VehicleType,plaqueNumber:string,date:string):Promise<boolean>

   ComeOut(lineCode:string,vehicleType:VehicleType,plaqueNumber:string,date:string):Promise<boolean>

   ReadUsingHistory(lineCode:string,vehicleType?:VehicleType,fromDate?:string,toDate?:string):Promise<LineEntranceDTO[]>

}