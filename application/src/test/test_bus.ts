/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { Contract, Gateway, GatewayOptions, Network } from 'fabric-network';
import * as path from 'path';
import { buildCCPOrg1, buildWallet, prettyJSONString } from '../utils/AppUtil';
import { buildCAClient, enrollAdmin, registerAndEnrollUser } from '../utils/CAUtil';
import {LineRepo} from '../repositories/lineRepo';
import {ILineRepo} from '../irepositories/ilineRepo';
import {LineDTO} from '../viewModels/lineModel';

import {LineEntranceDTO} from '../viewModels/lineEntranceModel';
import {ILineEntranceRepo} from '../irepositories/ilineEntranceRepo';
import {LineEntranceRepo} from '../repositories/lineEntranceRepo';

import {AirPollutantDTO,NoisePollutantDTO} from '../viewModels/pollutantModel';
import {PollutantRepo} from '../repositories/pollutantRepo';
import {IPollutantRepo} from '../irepositories/ipollutantRepo';

import {RepairingServiceDTO,RepairingServiceType} from '../viewModels/repairingServiceModel';
import {RepairingServiceRepo} from '../repositories/repairingServiceRepo';
import {IRepairingServiceRepo} from '../irepositories/irepairingServiceRepo';

import {StationDTO,StationType} from '../viewModels/stationModel';
import {StationRepo} from '../repositories/stationRepo';
import {IStationRepo} from '../irepositories/istationRepo';

import {StationLineDTO} from '../viewModels/stationLineModel';
import {StationLineRepo} from '../repositories/stationLineRepo';
import {IStationLineRepo} from '../irepositories/istationLineRepo';

import {VehicleDTO,VehicleType} from '../viewModels/vehicleModel';
import {VehicleRepo} from '../repositories/vehicleRepo';
import {IVehicleRepo} from '../irepositories/ivehicleRepo';

import {TicketDTO,TicketType} from '../viewModels/ticketModel';
import {TicketRepo} from '../repositories/ticketRepo';
import {ITicketRepo} from '../irepositories/iticketRepo';

import {TravelDTO} from '../viewModels/travelModel';
import {TravelRepo} from '../repositories/travelRepo';
import {ITravelRepo} from '../irepositories/itravelRepo';

import {MoveToStationDTO} from '../viewModels/moveToStationModel';
import {MoveToStationRepo} from '../repositories/moveToStationRepo';
import {IMoveToStationRepo} from '../irepositories/imoveToStationRepo';

import { readFileSync, promises as fsPromises } from 'fs';
import { join } from 'path';


const channelName = 'mychannel';
const chaincodeName = 'publicTrans';
const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');
const org1UserId = 'appUser';
const consoleInput:string=process.argv && process.argv.length>=2?process.argv[2]:undefined; 

async function main() {
    try {

        const ccp = buildCCPOrg1();

        const caClient = buildCAClient(ccp, 'ca.org1.example.com');

        const wallet = await buildWallet(walletPath);

        await enrollAdmin(caClient, wallet, mspOrg1);

        await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');

        const gateway = new Gateway();

        const gatewayOpts: GatewayOptions = {
            wallet,
            identity: org1UserId,
            discovery: { enabled: true, asLocalhost: true }, // using asLocalhost as this gateway is using a fabric network deployed locally
        };

        try {
            await gateway.connect(ccp, gatewayOpts);

            const network = await gateway.getNetwork(channelName);           
           
            if(consoleInput)
            {
                const nodeCount:number=parseInt(consoleInput);
                if(nodeCount>0)
                {
                        //Test Line
                        await test_Line_SmartContract(network,nodeCount);  
                        
                        //Test Station
                        await test_Station_SmartContract(network,nodeCount);

                        //Test Station Line
                        await test_StationLine_SmartContract(network,nodeCount);

                }

            }          
            
        } finally {
            gateway.disconnect();
        }
    } catch (error) {
        console.error(`******** FAILED to run the application: ${error}`);
    }
}

async function test_Line_SmartContract(network:Network,nodeCount:number){
   
    const contract:Contract = network.getContract(chaincodeName,'Line'); 
    var lineRepo:ILineRepo=new LineRepo(contract,nodeCount);  
    const fileContent:LineDTO[]= syncReadFile('linesList_OutPut.json');
    let createItemsCount:number=0;
    if(fileContent && fileContent.length>0)
    {        
        for(var index=0;index<fileContent.length;index++){
            var obj:LineDTO=fileContent[index];            
            if(obj != null){                
                if(obj.Title && obj.LineCode){
                   const title=obj.Title?obj.Title:'';
                   const lineCode=obj.LineCode?obj.LineCode:'';
                   const startPosition=obj.StartPosition?obj.StartPosition:'';
                   const endPosition=obj.EndPosition?obj.EndPosition:'';
                   const desc=obj.Desc?obj.Desc:'';
                   const result:boolean= await lineRepo.CreateLine(title,lineCode,startPosition,endPosition,desc);
                   if(result){
                    createItemsCount++;
                   }
                }  
            }
        }
    }
    console.log(`${createItemsCount} lines have been inserted successfully`);
    //let listOfItems:LineDTO[]=await lineRepo.ReadAllLines();
    //console.log('All Items:',listOfItems);
} 


async function test_Station_SmartContract(network:Network,nodeCount:number){
    const contract:Contract = network.getContract(chaincodeName,'Station');
    const stationRepo:IStationRepo=new StationRepo(contract,nodeCount);
    
    const fileContent:StationDTO[]= syncReadFile('stationsList_OutPut.json');
    let createItemsCount:number=0;
    if(fileContent && fileContent.length>0)
    {
        for(var index=0;index<fileContent.length;index++){
            var obj=fileContent[index];
            if(obj != null){
               const stationCode= obj.StationCode?obj.StationCode:'';
               const name=obj.Name?obj.Name:'';
               const address=obj.Address?obj.Address:'';
               const gpsLocation=obj.GPSLocation?obj.GPSLocation:'';
               const result:boolean= await stationRepo.CreateStation(stationCode,name,StationType.Bus,address,gpsLocation); 
               if(result){
                createItemsCount++;
               }
            }
        }
    }
    console.log(`${createItemsCount} stations have been inserted successfully`);
    //Sample Search
    //const allStationsList:StationDTO[]=await stationRepo.GetAllStations();
    //console.log('All Stations List:',allStationsList);


}

async function test_StationLine_SmartContract(network:Network,nodeCount:number){
    const contract:Contract = network.getContract(chaincodeName,'StationLine');
    const stationLineRepo:IStationLineRepo=new StationLineRepo(contract,nodeCount);
    const fileContent:StationLineDTO[]= syncReadFile('stationLinesList_OutPut.json');
    let createItemsCount:number=0;
    if(fileContent && fileContent.length>0)
    {
        for(var index=0;index<fileContent.length;index++){
            var obj=fileContent[index];
            if(obj != null){
               const stationCode= obj.StationCode?obj.StationCode:'';
               const lineCode=obj.LineCode?obj.LineCode:'';
               const forwardIndex=obj.ForwardIndex?obj.ForwardIndex:0;
               const backwardIndex=obj.BackwardIndex?obj.BackwardIndex:0;
               const result:boolean= await stationLineRepo.CreateStationLine(stationCode,lineCode,forwardIndex,backwardIndex); 
               if(result){
                createItemsCount++;
               }
            }
        }
    }
    console.log(`${createItemsCount} station lines have been inserted successfully`);

   
      
}

function random(min = 0, max = 1):number {
    let difference = max - min; 
    let rand = Math.random();   
    rand = Math.floor( rand * difference);   
    rand = rand + min;
    return rand;
}
function syncReadFile(filename: string): any[]{
    const filePath=join('/home/sir/fabric-samples/publicTrans/application/src/Data_Set/DataSet_London', filename);
    const fileContent = readFileSync(filePath, 'utf-8'); 
    let result:any[]=[];
    if(fileContent){
        result=JSON.parse(fileContent);
       /*fileContent.split(/\r?\n/).forEach((line,index) => {
             if(index != 0){
                const itemsList=line.split(',');
                result.push(itemsList);
             }
       });*/
    }
    return result;
  }
main();
