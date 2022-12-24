import {UserDTO} from '../viewModels/userModel';

export interface IUserRepo{
    CreateUSer(firstName:string,familyName:string,code:string,type:string):Promise<boolean>;

    UpdateUser(firstName:string,familyName:string,code:string,type:string):Promise<boolean>;

    ReadUser(code:string):Promise<UserDTO>;

    GetAllUsers(name?:string,type?:string):Promise<UserDTO[]>;
}