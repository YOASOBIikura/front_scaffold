import {useAxiosStore} from "@/pinia/modules/axios"
import { ethers } from "ethers"
//设置module
function setPrice(_pyth,_priceUpdateData){
    let axiosStore=useAxiosStore()
    let funcHex = new ethers.utils.Interface(["function setPrice(address _pyth,bytes[] _priceUpdateData) external"])
    let callData= funcHex.encodeFunctionData("setPrice", [ _pyth,_priceUpdateData]) 
    let value=0
    let target=axiosStore.currentContractData["PriceOracle"]
    
    return {
        target,
        value,
        callData
    }
}


export {setPrice}