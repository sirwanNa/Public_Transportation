import {RepairingServiceDTO,RepairingServiceType} from '../viewModels/repairingServiceModel';

export interface IRepairingServiceRepo{
    CreateService(vehicleCode:string,type:RepairingServiceType,date:string,kilometer:number,
        instrumentsList:string,repairer:string,desc?:string):Promise<boolean>;

    ReadRepairingHistory(vehicleCode:string,type?:RepairingServiceType,fromDate?:string,toDate?:string,repairer?:string)
        :Promise<RepairingServiceDTO[]>;
        
    FindNextNecessaryServices(year:number,month:number):Promise<RepairingServiceDTO[]>;    
    
}