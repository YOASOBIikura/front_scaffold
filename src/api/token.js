import { useAxiosStore } from "@/pinia/modules/axios";

//代币授权
function approveApi(token,spender,amount){
    return  useAxiosStore().axios({
        mode:"chainBlockSend", 
        target:token ,
        method:"approve",
        estimateGas:true,
        data:{
          value:0,
          param:{
             "address":spender,
             "uint256":amount
          }  
    }});
}


//代币转移
function transferApi(token,to,amount){
    return  useAxiosStore().axios({
        mode:"chainBlockSend", 
        target:token ,
        method:"transfer",
        estimateGas:true,
        data:{
          value:0,
          param:{
             "address":to,
             "uint256":amount
          }  
    }});
}


//balanceOf
function balanceOfApi(token,wallet){
    return useAxiosStore().axios({
        mode:"chainBlockCall", 
        target:token ,
        method:"balanceOf",
        data:{
          value:0,
          param:{
             "address":wallet,
          },
          returnsType:{
             "uint256":"balance"
          }  
    }});
}


//allownoce
function allownoceApi(token,owner,spender){
    return  useAxiosStore().axios({
        mode:"chainBlockCall", 
        target:token ,
        method:"allowance",
        data:{
          value:0,
          param:{
             "address:1":owner,
             "address:2":spender
          },
          returnsType:{
             "uint256:1":"allowance"
          }
    }});
}


//转移gas币
function transferEthApi(target,amount){
    return  useAxiosStore().axios({
        mode:"chainBlockSend", 
        estimateGas:true,
        target:target,
        data:{
          value:amount,
    }});
}


export {approveApi,transferApi,transferEthApi,allownoceApi,balanceOfApi}