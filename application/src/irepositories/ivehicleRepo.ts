import {VehicleDTO,VehicleType} from '../viewModels/vehicleModel';
export interface IVehicleRepo{

    CreateVehicle(vehicleCode:string,type:VehicleType,factory:string,
        model:string,constructionYear:string):Promise<boolean>;

    UpdateVehicle(vehicleCode:string,type:VehicleType,factory:string,
        model:string,constructionYear:string):Promise<boolean>;
        
    DeleteVehicle(vehicleCode:string):Promise<boolean>;
    
    ReadVehicle(vehicleCode:string):Promise<VehicleDTO>;

    GetAllVehicles(type?:VehicleType,factory?:string,model?:string):Promise<VehicleDTO[]>
}