import {parseRequest,parseResponse,makeHex} from "./chainBlockUtils"
import { BigNumber, ethers } from "ethers";

async function chainBlockSendRequest(_this,option){
    if( (!option.data || !option.data.param) && !option.data.value) {
        throw  new Error("lack field param")
     } 
     if(!option.method &&  !option.data.value){
        throw new Error("lack field method")
    }
     //复制一份请求信息
     let arg=JSON.parse(JSON.stringify(option.data)) ;
     let request=parseRequest(arg.param)
     let recipect=await sendContractTransition(_this,option,request.argType,request.argValue)
    //  let response=""
    //  if(hash){
    //     response= parseResponse(recipect.hash,arg.returnsType)
    //  }
     switch (recipect.txStatus){
          case 1:
              return {
                status:_this.statusSuccess,
                txStatus:"success",
                message:recipect.hash
              }
          case 2:
            return {
                status:_this.statusFail,
                txStatus:"fail",
                hash:recipect.hash
              }
          case 3:
             return {
                status:_this.statusFail,
                txStatus:"error",
                hash:recipect.message     
              }; 
     
     }

  
}



//发送交易
async function sendContractTransition(_this,option,argType,argValue){
    if(!option.target){
        throw new Error("lack field target")
     }
    let dataHex="0x";
    //如果method有值,则是调用合约 处理合约数据
    if(option.method != "" && option.method){
       dataHex=makeHex(option.method,argType,argValue)
    }
    let tx={
        from:_this.wallet,//拿provider的值
        to:option.target,
        data:dataHex,
        value:(option.data.value?option.data.value.toHexString():0)
     } 
     //是否预估gas
     if(option.estimateGas){
       let estimateGas= await estimateGasTx(_this,tx)
       tx["gasLimit"]=estimateGas.toString()
     }
     console.log("tx",tx)
     let hash;
     try{
       if(dataHex=="0x"){
           hash= await sendEthTx(_this,tx)
       }else{
          hash= await _this.chainBlockSendProvider.request({
            method:"eth_sendTransaction",
            params:[tx]
        })
       }

    }catch(error){
         return {
            txStatus:3,
            message:error,
         }
    }
    console.log("<hash>",hash)
    let recipect= await _this.chainBlockCallProvider.waitForTransaction(hash,option.data.safeBlock) 
    if(recipect.status==1){
        return {
            txStatus:1,
            hash:hash
        }
    }else{
         return {
            txStatus:2,
            hash:hash
         }
    }

}
//预估交易
async function  estimateGasTx(_this,tx){
  let provider= new ethers.providers.Web3Provider(_this.chainBlockSendProvider)
  let result= await provider.estimateGas(tx)
  result=result.mul(BigNumber.from("15")).div(BigNumber.from("10"))
  console.log("estimateGasTx",result)
  return result
}

//原生交易发送
async function sendEthTx(_this,tx){
   let provider= new ethers.providers.Web3Provider(_this.chainBlockSendProvider)
   let result=await provider.getSigner().sendTransaction(tx)
   console.log("hash",result)
   return result.hash
}


export {chainBlockSendRequest}