import { ethers } from "ethers"

function getVaultMaxSalt(_key,_wallet){
    let funcHex = new ethers.utils.Interface(["function getVaultMaxSalt(address wallet) external view returns (uint256)"])
    let callData= funcHex.encodeFunctionData("getVaultMaxSalt", [_wallet]) 
    let returnType={
          "uint256":"maxSalt"
    }
   return { 
       key:_key,
       contract:"@VaultFactory",
       param:callData,
       returnType:returnType,
    }
}


function getAddress(_key,_wallet,_salt){
    let funcHex = new ethers.utils.Interface(["function getAddress(address wallet,uint256 salt) public view returns (address)"])
    let callData= funcHex.encodeFunctionData("getAddress", [_wallet,_salt]) 
    let returnType={
          "address":"vault"
    }
   return { 
       key:_key,
       contract:"@VaultFactory",
       param:callData,
       returnType:returnType,
    }
}


export {getVaultMaxSalt,getAddress}