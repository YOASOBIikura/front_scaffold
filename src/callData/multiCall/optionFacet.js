import { ethers } from "ethers"
/**
 * 
   orderType  0 call  1 put
 */
function getSigatureLock(_key,_vault,_orderType,_underlyingAsset){
    let funcHex = new ethers.utils.Interface(["function getSigatureLock(address _vault,uint8 _orderType,address _underlyingAsset) external view"])
    let callData= funcHex.encodeFunctionData("getSigatureLock", [_vault,_orderType,_underlyingAsset]) 
    let returnType={
          "uint256":"timestamp"
    }
   return { 
       key:_key,
       contract:"@Diamond",
       param:callData,
       returnType:returnType,
    }
}


function getUnderlyTotal(_key,_vault,_orderType,_underlyingAsset){
    let funcHex = new ethers.utils.Interface(["function getUnderlyTotal(address _vault,uint8 _orderType,address _underlyingAsset) external view"])
    let callData= funcHex.encodeFunctionData("getUnderlyTotal",[_vault,_orderType,_underlyingAsset]) 
    let returnType={
          "uint256":"total"
    }
   return { 
       key:_key,
       contract:"@Diamond",
       param:callData,
       returnType:returnType,
    }
}

export {getSigatureLock,getUnderlyTotal}