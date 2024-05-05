import {useAxiosStore} from "@/pinia/modules/axios"
import {setVaultModule,setVaultMasterToken,setVaultTokens} from "@/callData/bundler/vaultManageModule" 
import {getAddress,getVaultMaxSalt,getVaultMaxSaltAddress} from "@/callData/multiCall/vaultFactory" 
import {getVaultToSalt} from "@/callData/multiCall/platformFacet" 
import { BigNumber } from "ethers"
import {multiCallObjR} from "@/apiHandle/multiCall"
var createVaultService=(vault) =>{
    let axiosStore=useAxiosStore()
    //组装白名单module
    let modles=[
        axiosStore.currentContractData["VaultManageModule"],
        axiosStore.currentContractData["VaultPaymaster"],
        axiosStore.currentContractData["IssuanceModule"],
        axiosStore.currentContractData["OptionModule"],
        axiosStore.currentContractData["OptionService"],
        axiosStore.currentContractData["PriceOracle"]
    ]
    let status=[true,true,true,true,true,true]
    let moduleCallData= setVaultModule(vault,modles,status)

    //组装vault白名单
    let tokenList=[]
    let typeList=[]
    axiosStore?.currentTokens?.forEach(item=>{
        tokenList.push(item.address)
        typeList.push(item.type)
    })
    let tokenCallData= setVaultTokens(vault,tokenList,typeList)
    // 设置masterToken
    let masterTokenCallData= setVaultMasterToken(vault,axiosStore.remark.masterToken)

    return [moduleCallData,tokenCallData,masterTokenCallData]
}




var getMulVaultR=async (data)=>{
    let multiCallData=[]
    let axiosStore=useAxiosStore()
    data.forEach(item=>{
         let callData
         if(item=="maxSalt"){
             callData=getVaultMaxSaltAddress(`${item}`,axiosStore.currentAccount) 
         }else{
             callData=getAddress(`${item}`,axiosStore.currentAccount,BigNumber.from(`${item}`))
         }
         multiCallData.push(callData)
    })
    let multiCallResponse= await  multiCallObjR(multiCallData)
   console.log("vault数据",multiCallResponse)
   return multiCallResponse  
}

// 获取vault下标
var getVaultToSaltR=async (vault)=>{
    let multiCallData=[]
    let callData= getVaultToSalt("getVaultToSalt",vault)
    multiCallData.push(callData)
    let multiCallResponse= await  multiCallObjR(multiCallData)
    console.log("multiCallResponse",multiCallResponse)
    return multiCallResponse["getVaultToSalt"]?.salt 
}




export {createVaultService,getMulVaultR,getVaultToSaltR}