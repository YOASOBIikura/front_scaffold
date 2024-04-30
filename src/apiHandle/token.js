import {useAxiosStore} from "@/pinia/modules/axios"
import {multiCallObjR} from "@/apiHandle/multiCall"
import {balanceOf} from "@/callData/multiCall/token"


var getMulTokenBalance=async (account,data)=>{
    let multiCallData=[]
    let axiosStore=useAxiosStore()
    data.forEach((item,index)=>{
         let callData=balanceOf(`${index}`,item,account)
         multiCallData.push(callData)
    })
    let multiCallResponse= await  multiCallObjR(multiCallData)
    let result=[]
    for (let key in multiCallResponse){
        result.push(multiCallResponse[key]?.balance)
    }

    console.log("余额数据",result)
    return result
}

export {getMulTokenBalance}