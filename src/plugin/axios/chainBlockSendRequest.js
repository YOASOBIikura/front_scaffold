import { ethers} from "ethers";
import {parseRequest,parseResponse,makeHex} from "./chainBlockUtils"

async function chainBlockSendRequest(_this,option){
    if( !option.data || !option.data.param) {
        throw  new Error("lack field param")
     } 
     if(!option.method){
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
     return {
         status:_this.statusSuccess,
         txStatus:recipect.txStatus,
         hash:recipect.hash
       
     }; 
}
//发送交易
async function sendContractTransition(_this,option,argType,argValue){
    if(!option.target){
        throw new Error("lack field target")
     }
    let dataHex="0x";
    if(option.method != ""){
       dataHex=makeHex(option.method,argType,argValue)
    }
   
    let tx={
        from:_this.wallet,//拿provider的值
        to:option.target,
        data:dataHex,
        value:(option.data.value?String(option.data.value):0)
     } 
     let hash= await _this.chainBlockSendProvider.request({
         method:"eth_sendTransaction",
         params:[tx]
     })
    console.log("<hash>",hash)
    let recipect= await _this.chainBlockCallProvider.waitForTransaction(hash,option.data.safeBlock) 
    if(recipect.status==1){
        return {
            txStatus:true,
            hash:hash
        }
    }else{
         return {
            txStatus:false,
            hash:hash
         }
    }

}
export {chainBlockSendRequest}