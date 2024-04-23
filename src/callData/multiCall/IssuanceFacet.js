import { ethers } from "ethers"

function getIssueMode(_key,_vault){
    let funcHex = new ethers.utils.Interface(["function getIssueMode(address _vault) external view"])
    let callData= funcHex.encodeFunctionData("getIssueMode", [_vault]) 
    let returnType={
          "uint8":"issueMode"
    }
   return { 
       key:_key,
       contract:"@Diamond",
       param:callData,
       returnType:returnType,
    }
}


export {getIssueMode}