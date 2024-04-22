import { ethers } from "ethers"

function getAllModules(_key){
    let funcHex = new ethers.utils.Interface(["function getAllModules() external view returns(address[] memory)"])
    let callData= funcHex.encodeFunctionData("getAllModules", []) 
    let returnType={
          "address[]":"moduleList"
    }
   return { 
       key:_key,
       contract:"@Diamond",
       param:callData,
       returnType:returnType,
    }
}

function getTokens(_key){
    let funcHex = new ethers.utils.Interface(["function getTokens() external view returns(address[] memory)"])
    let callData= funcHex.encodeFunctionData("getTokens", []) 
    let returnType={
          "address[]":"tokenList"
    }
   return { 
       key:_key,
       contract:"@Diamond",
       param:callData,
       returnType:returnType,
    }
}


function getTokenType(_key,_token){
    let funcHex = new ethers.utils.Interface(["function getTokenType(address _token) external view returns(uint256)"])
    let callData= funcHex.encodeFunctionData("getTokenType", [_token]) 
    let returnType={
          "uint256":"tokenType"
    }
   return { 
       key:_key,
       contract:"@Diamond",
       param:callData,
       returnType:returnType,
    }
}




function getAssetTypeCount(_key){
    let funcHex = new ethers.utils.Interface(["function getAssetTypeCount() external view returns(uint256)"])
    let callData= funcHex.encodeFunctionData("getAssetTypeCount", []) 
    let returnType={
          "uint256":"assetTypeCount"
    }
    return { 
       key:_key,
       contract:"@Diamond",
       param:callData,
       returnType:returnType,
    }
}


export {getAllModules,getTokens,getTokenType,getAssetTypeCount}