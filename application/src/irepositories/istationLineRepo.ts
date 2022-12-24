import {StationLineDTO} from '../viewModels/stationLineModel';

export interface IStationLineRepo{
    
    CreateStationLine(stationCode:string,lineCode:string,forwardIndex:number,backwardIndex:number):Promise<boolean>;

    UpdateStationLine(stationCode:string,lineCode:string,forwardIndex:number,backwardIndex:number):Promise<boolean>;

    DeleteStationLine(stationCode:string,lineCode:string):Promise<boolean>;

    ReadStationLine(stationCode:string,lineCode:string):Promise<StationLineDTO>;

    GetAllStationsOfLine(lineCode:string):Promise<StationLineDTO[]>;
}