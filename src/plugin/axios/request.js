import {chainBlockCallRequest} from "./chainBlockCallRequest"
import {httpRequest} from "./httpRequest"
import {chainBlockSendRequest} from "./chainBlockSendRequest"
import {switchNetwork} from "./switchNetwork"
import {sign,unSign,sign712} from "./signRequest"
import {chainBlockNormal} from "./chainBlockNormal";


//请求分流
async function request(_this,option){
    if(!option.mode){
       throw new Error("lack field mode")
    }
    let response
    // 请求分流
    switch(option.mode){
       case "chainBlockNormal":
          response=await chainBlockNormal(_this,option)
          break;
       case "http":
        response=await httpRequest(_this,option)
          break
       case "chainBlockCall":
        response=await chainBlockCallRequest(_this,option)
          break
       case "chainBlockSend":
        response=await chainBlockSendRequest(_this,option)
          break;
       case "sign":
         response=await sign(_this,option)
          break
       case "sign712":
            response=await sign712(_this,option)   
            break    
       case "unSign":
         response=await unSign(_this,option)
          break;  
       case "switchChain" :
         response=switchNetwork(_this,option)
          break  
       default :
           throw new Error("request mode error")          
    }
    return response;
}

export default request;