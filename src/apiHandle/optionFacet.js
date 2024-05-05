import {useAxiosStore} from "@/pinia/modules/axios"
import {multiCallObjR} from "@/apiHandle/multiCall"
import {getPutOrder,getCallOrder} from "@/callData/multiCall/optionFacet"
import { BigNumber, ethers } from "ethers"


var getOptionOrderExistR=async (dataList)=>{
    let multiCallData=[]
    let axiosStore=useAxiosStore()
    let result=[]
    dataList?.forEach((item,index)=>{
          let callData=""
          if(item.orderType==0){
              callData= getCallOrder(`${index}`,item.orderId)
          }else{
              callData= getPutOrder(`${index}`,item.orderId)
          }
          multiCallData.push(callData)
    })
    let multiCallResponse= await  multiCallObjR(multiCallData)
   
    for (let key in multiCallResponse){
        if(multiCallResponse[key]?.order?.holder == ethers.constants.AddressZero){
            result[Number(key)]=false
        }else{
            result[Number(key)]=true
        }
      
    }
    return result
}

export {getOptionOrderExistR}