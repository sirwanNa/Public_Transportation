import {LineDTO} from '../viewModels/lineModel';
export interface ILineRepo{

    CreateLine(title:string,lineCode:string,startPosition:string,endPosition:string,desc:string):Promise<boolean>

    UpdateLine(title:string,lineCode:string,startPosition:string,endPosition:string,desc:string):Promise<boolean>

    DeleteLine(lineCode:string):Promise<boolean>

    ReadLine(lineCode:string):Promise<LineDTO>

    ReadAllLines(title?:string,lineCode?:string):Promise<LineDTO[]>

}