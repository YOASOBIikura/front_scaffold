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


function getPutOrder(_key,_orderId){
    let funcHex = new ethers.utils.Interface(["function getPutOrder( uint64 _orderId) external view"])
    let callData= funcHex.encodeFunctionData("getPutOrder",[_orderId]) 
    let returnType={
        "tuple:order":{
            "address:1":"holder"
        }
    }
    return { 
        key:_key,
        contract:"@Diamond",
        param:callData,
        returnType:returnType,
     }
}
function getCallOrder(_key,_orderId){
    let funcHex = new ethers.utils.Interface(["function getCallOrder( uint64 _orderId) external view"])
    let callData= funcHex.encodeFunctionData("getCallOrder",[_orderId]) 
    let returnType={
        "tuple:order":{
            "address:1":"holder"
        }
    }
    return { 
        key:_key,
        contract:"@Diamond",
        param:callData,
        returnType:returnType,
     }
}


export {getSigatureLock,getUnderlyTotal,getPutOrder,getCallOrder}