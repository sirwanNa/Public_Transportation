import {MoveToStationDTO} from '../viewModels/moveToStationModel';

export interface IMoveToStationRepo{

    Input(stationCode:string,lineCode:string,vehicleCode:string,date:string,direction:number):Promise<boolean>;
    
    Input_V2(id:string,stationLineId:string,vehicleCode:string,date:string,direction:number):Promise<boolean>

    Output(stationCode:string,lineCode:string,vehicleCode:string,date:string,direction:number):Promise<boolean>;

    Output_V2(id:string,stationLineId:string,vehicleCode:string,date:string,direction:number):Promise<boolean>;

    FindComingVehicles(stationCode:string):Promise<MoveToStationDTO[]>;

    ReadHistoryOfMovement(lineCode:string,stationCode:string,direction?:number,fromDate?:string,toDate?:string):Promise<MoveToStationDTO[]>;
}