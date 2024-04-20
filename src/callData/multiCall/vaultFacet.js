import { ethers } from "ethers"


function getVaultPosition(_vault,_positionTypes){
    let funcHex = new ethers.utils.Interface(["function getVaultAllPosition(address _vault,uint16[] memory _positionTypes) external view"])
    let callData= funcHex.encodeFunctionData("getVaultAllPosition", [ _vault,_positionTypes]) 
    let returnType={
          "tuple[]":[{
             "uint16":"positionType",
             "uint16":"debtType",
             "uint16":"ableUse",
             "address":"component",
             "uint256":"balance",
             "bytes":"data",
          }],
          "uint256[]":"decimals"
    }
   return { 
       key:"vaultPosition",
       contract:"@Manager",
       param:callData,
       returnType:returnType,
    }
}

//获取钱包的全部vault
function getAllVaultByWallet(_wallet){
    let funcHex = new ethers.utils.Interface(["function getAllVaultByWallet(address _wallet) external view returns(address[] memory)"])
    let callData= funcHex.encodeFunctionData("getAllVaultByWallet", [_wallet]) 
    let returnType={
          "address[]":"vaultList"
    }
   return { 
       key:"getAllVaultByWallet",
       contract:"@Diamond",
       param:callData,
       returnType:returnType,
    }
}


function getVaultType(_vault){
    let funcHex = new ethers.utils.Interface(["function getVaultType(address _vault) external view returns (uint256)"])
    let callData= funcHex.encodeFunctionData("getVaultType", [_vault]) 
    let returnType={
          "uint256":"vaultType"
    }
   return { 
       key:"getVaultType",
       contract:"@Diamond",
       param:callData,
       returnType:returnType,
    }
}



function getVaultLock(_vault){
    let funcHex = new ethers.utils.Interface(["function getVaultLock(address _vault) external view returns (bool)"])
    let callData= funcHex.encodeFunctionData("getVaultLock", [_vault]) 
    let returnType={
          "bool":"isLock"
    }
   return { 
       key:"getVaultLock",
       contract:"@Diamond",
       param:callData,
       returnType:returnType,
    }
}


function getVaultLock(_vault){
    let funcHex = new ethers.utils.Interface(["function getVaultLock(address _vault) external view returns (bool)"])
    let callData= funcHex.encodeFunctionData("getVaultLock", [_vault]) 
    let returnType={
          "bool":"isLock"
    }
   return { 
       key:"getVaultLock",
       contract:"@Diamond",
       param:callData,
       returnType:returnType,
    }
}


export {getVaultPosition,getAllVaultByWallet,getVaultType,getVaultLock}