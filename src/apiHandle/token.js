import {useAxiosStore} from "@/pinia/modules/axios"
import {multiCallObjR} from "@/apiHandle/multiCall"
import {balanceOf} from "@/callData/multiCall/token"
import {getWalletBalanceApi} from "@/api/utils"
import { BigNumber } from "ethers"


var getMulTokenBalance=async (accountList,dataList)=>{
    let multiCallData=[]
    let axiosStore=useAxiosStore()
    let result=[]
    for(let i=0;i<dataList.length;i++){
        //判断代币是否是gasToken
        let token=axiosStore.getTokenByAddress(dataList[i])
        if(!token?.isGasToken){
            let callData=balanceOf(`${i}`,dataList[i],accountList[i])
            multiCallData.push(callData)
        }else{
            let gasToken=await getWalletBalanceApi(accountList[i])
            result[i]=gasToken?.message || BigNumber.from("0")
        }
  
    }
    let multiCallResponse= await  multiCallObjR(multiCallData)
   
    for (let key in multiCallResponse){
        result[Number(key)]=multiCallResponse[key]?.balance
    }

    console.log("余额数据",result)
    return result
}

export {getMulTokenBalance}