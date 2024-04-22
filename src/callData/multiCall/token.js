import { ethers } from "ethers"

function balanceOf(_key,_tokenAddress,_account){
    let funcHex = new ethers.utils.Interface(["function balanceOf(address account) public view returns(uint256)"])
    let callData= funcHex.encodeFunctionData("balanceOf", [_account]) 
    let returnType={
          "uint256":"balance"
    }
   return { 
       key:_key,
       contract:_tokenAddress,
       param:callData,
       returnType:returnType,
    }
}

function decimals(_key,_tokenAddress){
    let funcHex = new ethers.utils.Interface(["function decimals() public view returns(uint256)"])
    let callData= funcHex.encodeFunctionData("decimals",[]) 
    let returnType={
          "uint256":"decimals"
    }
   return { 
       key:_key,
       contract:_tokenAddress,
       param:callData,
       returnType:returnType,
    }
}
function symbol(_key,_tokenAddress){
    let funcHex = new ethers.utils.Interface(["function symbol() public view  returns(string memory)"])
    let callData= funcHex.encodeFunctionData("symbol", []) 

    console.log("symnol",callData,"---")
    let returnType={
          "string":"symbol"
    }
   return { 
       key:_key,
       contract:_tokenAddress,
       param:callData,
       returnType:returnType,
    }
}
function name(_key,_tokenAddress){
    let funcHex = new ethers.utils.Interface(["function name() public view  returns(string memory)"])
    let callData= funcHex.encodeFunctionData("name", []) 
    let returnType={
          "string":"name"
    }
   return { 
       key:_key,
       contract:_tokenAddress,
       param:callData,
       returnType:returnType,
    }
}
function allowance(_key,_tokenAddress,_owner,_account){
    let funcHex = new ethers.utils.Interface(["function allowance(address owner, address spender) public view virtual override returns (uint256)"])
    let callData= funcHex.encodeFunctionData("allowance", [_owner,_account]) 
    let returnType={
          "uint256":"allowance"
    }
    return { 
       key:_key,
       contract:_tokenAddress,
       param:callData,
       returnType:returnType,
    }
} 

export {balanceOf,decimals,symbol,name,allowance}