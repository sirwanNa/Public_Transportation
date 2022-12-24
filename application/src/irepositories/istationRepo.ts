import {StationDTO,StationType} from '../viewModels/stationModel';

export interface IStationRepo{

    CreateStation(stationCode:string,name:string,type:StationType,address:string,gpsLocation:string):Promise<boolean>;

    UpdateStation(stationCode:string,name:string,type:StationType,address:string,gpsLocation:string):Promise<boolean>;

    DeleteStation(stationCode:string):Promise<boolean>;

    ReadStation(stationCode:string):Promise<StationDTO>;

    GetAllStations(name?:string,stationCode?:string,type?:StationType):Promise<StationDTO[]>;

}