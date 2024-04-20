import { useAxiosStore } from "@/pinia/modules/axios";

//代币授权
function approveApi(toekn,spender,amount){
    return  useAxiosStore().axios({
        mode:"chainBlockSend", 
        target:toekn ,
        method:"approve",
        data:{
          value:0,
          param:{
             "address":spender,
             "uint256":amount
          }  
    }});
}


//代币转移
function transferApi(toekn,to,amount){
    return  useAxiosStore().axios({
        mode:"chainBlockSend", 
        target:toekn ,
        method:"transfer",
        data:{
          value:0,
          param:{
             "address":to,
             "uint256":amount
          }  
    }});
}

//转移gas币
function transferEthApi(target,amount){
    return  useAxiosStore().axios({
        mode:"chainBlockSend", 
        target:target,
        data:{
          value:amount,
    }});
}


export {approveApi,transferApi,transferEthApi}