import {TravelDTO} from '../viewModels/travelModel';

export interface ITravelRepo{
    AddTransaction(ticketCode:string,stationCode:string,date:string):Promise<boolean>;

    FindTravelHistory(ticketCode:string):Promise<TravelDTO[]>;
}