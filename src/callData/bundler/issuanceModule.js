import {useAxiosStore} from "@/pinia/modules/axios"
import { ethers } from "ethers"
function issue(_vault,_from,_assets,_amounts){
    let axiosStore=useAxiosStore()
    let funcHex = new ethers.utils.Interface(["function issue(address _vault,address payable _from,address[] memory _assets,uint256[] memory _amounts) external payable"])
    let callData= funcHex.encodeFunctionData("issue", [_vault,_from,_assets,_amounts]) 
    let value=0
    let target=axiosStore.currentContractData["IssuanceModule"]
    
    return {
        target,
        value,
        callData
    }
}

    
function redeem(_vault,_to,_assetsType,_assets,_amounts){
    let axiosStore=useAxiosStore()
    let funcHex = new ethers.utils.Interface(["function redeem(address _vault,address payable _to,uint256[] memory _assetsType,address[] memory _assets,uint256[] memory _amounts) external"])
    let callData= funcHex.encodeFunctionData("redeem", [_vault,_to,_assetsType,_assets,_amounts]) 
    let value=0
    let target=axiosStore.currentContractData["IssuanceModule"]
    
    return {
        target,
        value,
        callData
    }
}

function redeemProxy(_vault,_assetsType,_assets,_amounts){
    let axiosStore=useAxiosStore()
    let funcHex = new ethers.utils.Interface(["function redeemProxy(address _vault, uint256[] memory _assetsType,address[] memory _assets, uint256[] memory _amounts) external"])
    let callData= funcHex.encodeFunctionData("redeemProxy", [_vault,_assetsType,_assets,_amounts]) 
    let value=0
    let target=axiosStore.currentContractData["IssuanceModule"] 
    return {
        target,
        value,
        callData
    }
}

export {issue,redeem,redeemProxy}