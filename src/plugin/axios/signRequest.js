
import { ethers} from "ethers";


async function sign(_this,option){
    console.log(option.data,"--签名--")
    if(!option.data || !option.data.param){
        throw new Error("lack field param")
    }
    let dataHex = ethers.utils.toUtf8Bytes(option.data.param);
    let message = ethers.utils.keccak256(dataHex);
    let result={
          status:_this.statusSuccess,
          message:""
    }
    try{
        result["message"]= await _this.chainBlockSendProvider.request({
            method:"eth_sign",
            params:[_this.wallet,message]
        })
    }catch(error){
        result={
            status:_this.statusFail,
            message:error.message
        }
    }
    return result
}


async function unSign(_this,option){
    if(!option.data || !option.data.param){
        throw new Error("lack field param")
    }
    if(!option.data.signData){
        throw new Error("lack field signData")
    }
    let dataBytes= ethers.utils.keccak256(ethers.utils.toUtf8Bytes(option.data.param)) 

    return  {
       status:true,
       message:ethers.utils.recoverAddress(dataBytes,option.data.signData)
    }
}
//-------------712签名-------------
async function sign712(_this,option){
    if(!option.data || !option.data.domain){
        throw new Error("lack field domain")
    }
    if(!option.data.types){
        throw new Error("lack field types")
    }
    if(!option.data.message){
        throw new Error("lack field message")
    }
    return  await sign712Normal(_this,option)
}

//v4签名
async function sign712V4(_this,option){
    if(!option.data.primaryType){
        throw new Error("lack field primaryType")
    }
    let param={
        domain:option.data.domain,
        message:option.data.message,
        primaryType:option.data.primaryType,
        types:option.data.types
    }
    let result={
        status:_this.statusSuccess,
        message:""
    }
    try{ 
        result["message"]= await  _this.chainBlockSendProvider.request({
          method:"eth_signTypedData_v4",
          params:[_this.wallet,JSON.stringify(param)]
        })
    }catch(error){
        result={
            status:_this.statusFail,
            message:error.message
        }
    }
    return result
}
//v3签名
async function sign712V3(_this,option){
    if(!option.data.primaryType){
        throw new Error("lack field primaryType")
    }    
   const data = JSON.stringify({
        types: option.data.types,
        domain: option.data.domain,
        primaryType: option.data.primaryType,
        message: option.data.message
    });
    let result={
        status:_this.statusSuccess,
        message:""
    }
    try{ 
        result["message"]= await  _this.chainBlockSendProvider.request({
        method:"eth_signTypedData_v3",
        params:[_this.wallet,data]
    })
}catch(error){

        result={
            status:_this.statusFail,
            message:error.message
        }
    }
    return result
}

// ether方法签名
async function sign712Normal(_this,option){
   let signer=await _this.chainBlockCallProvider.getSigner()
   let types={}
   for(let k in option.data.types){
         if(k!="EIP712Domain"){
            types[k]=option.data.types[k]
         }
   }
   let result={
       status:_this.statusSuccess,
       message:""
   }
   try{
    result["message"] =await signer._signTypedData(option.data.domain,types,option.data.message)
   }catch(error){
    result={
        status:_this.statusFail,
        message:error.message
    }
   }
   return result
}

export {sign,unSign,sign712}