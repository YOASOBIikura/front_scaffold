import { ethers } from "ethers"

function getAllModules(){
    let funcHex = new ethers.utils.Interface(["function getAllModules() external view returns(address[] memory)"])
    let callData= funcHex.encodeFunctionData("getAllModules", []) 
    let returnType={
          "address[]":"moduleList"
    }
   return { 
       key:"getAllModules",
       contract:"@Diamond",
       param:callData,
       returnType:returnType,
    }
}

function getTokens(){
    let funcHex = new ethers.utils.Interface(["function getTokens() external view returns(address[] memory)"])
    let callData= funcHex.encodeFunctionData("getTokens", []) 
    let returnType={
          "address[]":"tokenList"
    }
   return { 
       key:"getTokens",
       contract:"@Diamond",
       param:callData,
       returnType:returnType,
    }
}


function getTokenType(_token){
    let funcHex = new ethers.utils.Interface(["function getTokenType(address _token) external view returns(uint256)"])
    let callData= funcHex.encodeFunctionData("getTokenType", [_token]) 
    let returnType={
          "uint256":"tokenType"
    }
   return { 
       key:"getTokenType",
       contract:"@Diamond",
       param:callData,
       returnType:returnType,
    }
}




function getAssetTypeCount(){
    let funcHex = new ethers.utils.Interface(["function getAssetTypeCount() external view returns(uint256)"])
    let callData= funcHex.encodeFunctionData("getAssetTypeCount", []) 
    let returnType={
          "uint256":"assetTypeCount"
    }
    return { 
       key:"getAssetTypeCount",
       contract:"@Diamond",
       param:callData,
       returnType:returnType,
    }
}


export {getAllModules,getTokens,getTokenType,getAssetTypeCount}