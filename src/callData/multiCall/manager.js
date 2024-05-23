import { ethers } from "ethers"

function getVaultAllPosition(_key,_vault,_positionTypes){
    let funcHex = new ethers.utils.Interface(["function getVaultAllPosition(address _vault,uint16[] memory _positionTypes) external view"])
    let callData= funcHex.encodeFunctionData("getVaultAllPosition", [ _vault,_positionTypes]) 
    let returnType={
          "tuple[]:positions":[{
             "uint16:1":"positionType",
             "uint16:2":"debtType",
             "uint16:3":"ableUse",
             "address:4":"component",
             "uint256:5":"balance",
             "bytes:6":"data"
          }],
          "uint256[]":"decimals"
    }
   return { 
       key:_key,
       contract:"@Manager",
       param:callData,
       returnType:returnType,
    }
}

function getVaultAllModules(_key, _valut){
    let funcHex = new ethers.utils.Interface(["function getVaultAllModules(address _vault) external view"]);
    let callData = funcHex.encodeFunctionData("getVaultAllModules", [_valut]);
    let returnType = {
        "address[]": "module"
    }
    return {
        key: _key,
        contract:"@Manager",
        param: callData,
        returnType:returnType
    }
}

export {getVaultAllPosition, getVaultAllModules}    