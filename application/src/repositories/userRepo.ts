
import {UserDTO} from '../viewModels/userModel';
import { Contract } from 'fabric-network/lib/contract';
import {prettyJSONString } from '../utils//AppUtil';
import {IUserRepo} from '../irepositories/iuserRepo'

export class UserRepo implements IUserRepo{
    private _contract:Contract;
    constructor(contract:Contract){
        this._contract=contract;
    }
    public async CreateUSer(firstName:string,familyName:string,code:string,type:string):Promise<boolean>
    {
        try
        {
            await this._contract.submitTransaction('CreateUser',firstName,familyName,code,type);
            console.log('New User Has Been Created');
            return true;
        }
        catch(error){
           console.log(error); 
           return false;
        }

    }
    public async UpdateUser(firstName:string,familyName:string,code:string,type:string):Promise<boolean>
    {
        try
        {
            await this._contract.submitTransaction('UpdateUser',firstName,familyName,code,type);
            console.log(`User ${code} Has Been Updated`);
            return true;
        }
        catch(error){
           console.log(error); 
           return false;
        }
    }

    public async ReadUser(code:string):Promise<UserDTO>
    {
        try
        {
          let data = await this._contract.evaluateTransaction('ReadUser',code);
          let jsonString:string=prettyJSONString(data.toString()); 
          var jsonObj=JSON.parse(jsonString); 
          var result:UserDTO=new UserDTO();  
          result.Code=jsonObj['Code'];   
          result.FamilyName=jsonObj['FamilyName']; 
          result.FirstName=jsonObj['FirstName'];   
          result.ID=jsonObj['Id'];
          result.Entity=jsonObj['Entity'];
          result.Type=jsonObj['Type'];
          return result;
        }
        catch(error){
           console.log(error);
           var result:UserDTO;
           return result;
        }   
    }

    public async GetAllUsers(name:string='',type:string=''):Promise<UserDTO[]>
    {
        try
        {
          let data = await this._contract.evaluateTransaction('GetAllUsers',name,type);
          let jsonString:string=prettyJSONString(data.toString());  
          var jsonObj=JSON.parse(jsonString);
          var result:UserDTO[]=jsonObj;
          return result;
        }
        catch(error){
           console.log(error);
           var result:UserDTO[];
           return result;
        } 
    }
}