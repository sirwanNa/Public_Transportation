import {BaseViewModel} from "./baseModel";

export enum TicketType{
    Disposable='Disposable',
    Rechargeable ='Rechargeable'
}

export class TicketDTO extends BaseViewModel{  
    TicketCode:string;
    Type:TicketType;
    Balance:number;
    Creator:string;
    Date:string;
    PassengerCode:string;
}