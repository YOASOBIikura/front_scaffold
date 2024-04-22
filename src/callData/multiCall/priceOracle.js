import { ethers } from "ethers"
function getPrice(_key,_masterToken,_quoteToken){
    let funcHex = new ethers.utils.Interface(["function getPrice(address _masterToken,address _quoteToken) external view"])
    let callData= funcHex.encodeFunctionData("getPrice", [_masterToken,_quoteToken]) 
    let returnType={
          "uint256":"price"
    }
   return { 
       key:_key,
       contract:"@PriceOracle",
       param:callData,
       returnType:returnType,
    }
}

export {getPrice}
