import { ethers } from "ethers"

//获取钱包的全部vault
function getAllVaultByWallet(_key,_wallet){
    let funcHex = new ethers.utils.Interface(["function getAllVaultByWallet(address _wallet) external view returns(address[] memory)"])
    let callData= funcHex.encodeFunctionData("getAllVaultByWallet", [_wallet]) 
    let returnType={
          "address[]":"vaultList"
    }
   return { 
       key:_key,
       contract:"@Diamond",
       param:callData,
       returnType:returnType,
    }
}


function getVaultType(_key,_vault){
    let funcHex = new ethers.utils.Interface(["function getVaultType(address _vault) external view returns (uint256)"])
    let callData= funcHex.encodeFunctionData("getVaultType", [_vault]) 
    let returnType={
          "uint256":"vaultType"
    }
   return { 
       key:_key,
       contract:"@Diamond",
       param:callData,
       returnType:returnType,
    }
}



function getVaultLock(_key,_vault){
    let funcHex = new ethers.utils.Interface(["function getVaultLock(address _vault) external view returns (bool)"])
    let callData= funcHex.encodeFunctionData("getVaultLock", [_vault]) 
    let returnType={
          "bool":"isLock"
    }
   return { 
       key:_key,
       contract:"@Diamond",
       param:callData,
       returnType:returnType,
    }
}


function getVaultLock(_key,_vault){
    let funcHex = new ethers.utils.Interface(["function getVaultLock(address _vault) external view returns (bool)"])
    let callData= funcHex.encodeFunctionData("getVaultLock", [_vault]) 
    let returnType={
          "bool":"isLock"
    }
   return { 
       key:_key,
       contract:"@Diamond",
       param:callData,
       returnType:returnType,
    }
}


export {getVaultPosition,getAllVaultByWallet,getVaultType,getVaultLock}