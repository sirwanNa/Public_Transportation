import {AirPollutantDTO,NoisePollutantDTO} from '../viewModels/pollutantModel';

export interface IPollutantRepo{
   
    InsertAirData(stationCode:string,date:string,co2:number,
        co:number,so2:number,no2:number,o3:number,humidity:number):Promise<boolean>;

    InsertNoiseData(stationCode:string,date:string,l10:number,l50:number,l95:number,
        l99:number,leq:number,sel:number,spl:number,l_min:number,l_max:number):Promise<boolean>;

    ReadAirPollutionHistory(stationCode:string,fromDate?:string,toDate?:string):Promise<AirPollutantDTO[]>    
    
    ReadNoisePollutionHistory(stationCode:string,fromDate?:string,toDate?:string):Promise<NoisePollutantDTO[]>;

}