import { ethers } from "ethers"
import {useAxiosStore} from "@/pinia/modules/axios"

function setSigatureLock(_vault,_orderType,_underlyingAsset,_timestamp) {
    let axiosStore=useAxiosStore()
    let funcHex = new ethers.utils.Interface(["function setSigatureLock(address _vault,uint8 _orderType,address _underlyingAsset,uint256 _timestamp) external"])
    let callData= funcHex.encodeFunctionData("setSigatureLock", [ _vault,_orderType, _underlyingAsset,_timestamp]) 
    let value=0
    let target=axiosStore.currentContractData["OptionModule"]
    return {
        target,
        value,
        callData
    }
}

export {setSigatureLock}
