import {TicketDTO,TicketType} from '../viewModels/ticketModel';

export interface ITicketRepo{

    CreateTicket(ticketCode:string,type:TicketType,initiateBalance:number,creator:string,date:string):Promise<boolean>;

    UpdateTicket(ticketCode:string,type:TicketType,initiateBalance:number,creator:string,date:string,passengerCode:string):Promise<boolean>;

    DeleteTicket(ticketCode:string):Promise<boolean>;

    AssignTicket(ticketCode:string,passengerCode:string,date:string):Promise<boolean>;

    RechargeTicket(ticketCode:string,balance:number,date:string):Promise<boolean>;

    ReadTicket(ticketCode:string):Promise<TicketDTO>;

    ReadTickesList(fromDate?:string,toDate?:string,creatorCode?:string,passengerCode?:string):Promise<TicketDTO[]>;

}