/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { Contract, Gateway, GatewayOptions, Network } from 'fabric-network';
import * as path from 'path';
import { buildCCPOrg1, buildWallet } from '../utils/AppUtil';
import { buildCAClient, enrollAdmin, registerAndEnrollUser } from '../utils/CAUtil';


import {MoveToStationTranformation} from '../viewModels/moveToStationModel';
import {MoveToStationRepo} from '../repositories/moveToStationRepo';
import {IMoveToStationRepo} from '../irepositories/imoveToStationRepo';

import { readFileSync, promises as fsPromises } from 'fs';



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
                const fileIndex:number=parseInt(consoleInput);
                console.log(`File ${fileIndex} has been started`);
                await test_MoveToStation_SmartContract(network,fileIndex);

            }          
            
        } finally {
            gateway.disconnect();
        }
    } catch (error) {
        console.error(`******** FAILED to run the application: ${error}`);
    }
}

async function test_MoveToStation_SmartContract(network:Network,file_Index:number){
    const contract:Contract = network.getContract(chaincodeName,'MoveToStations');
    const moveToStationRepo:IMoveToStationRepo=new MoveToStationRepo(contract,2);
    const fileContent:MoveToStationTranformation[]= syncReadFile(file_Index);
    //console.log("fileContent:",fileContent);
    let createItemsCount:number=0;
    if(fileContent && fileContent.length>0)
    {
        for(var index=0;index<fileContent.length;index++){
            var obj=fileContent[index];
            if(obj != null){
               const inputId= obj.InputId?obj.InputId:'';
               const outputId= obj.OutputId?obj.OutputId:'';
               const stationLineId= obj.StationLineId?obj.StationLineId:'';               
               const inputDate=obj.InputDate?obj.InputDate:'';
               const outputDate=obj.OutputDate?obj.OutputDate:'';
               const direction=obj.Direction?obj.Direction:0;
               const vehicleCode=obj.VehicleCode?obj.VehicleCode:'';              
               const input_result:boolean= await moveToStationRepo.Input_V2(inputId,stationLineId,vehicleCode,inputDate,direction); 
               if(input_result){
                createItemsCount++;
               }              
              
               const out_result:boolean= await moveToStationRepo.Output_V2(outputId,stationLineId,vehicleCode,outputDate,direction); 
               if(out_result){
                createItemsCount++;
               }
            }
        }
    }
    console.log(`${createItemsCount} items inserted successfully`);
}




function random(min = 0, max = 1):number {
    let difference = max - min; 
    let rand = Math.random();   
    rand = Math.floor( rand * difference);   
    rand = rand + min;
    return rand;
}
function syncReadFile(fileIndex: number): any[]{
    const filePath=`/home/sir/fabric-samples/publicTrans/application/src/Data_Set/DataSet_London/movetOStation/moveToStation_${fileIndex}_OutPut.json`;
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
