import { useAxiosStore } from "../pinia/modules/axios";
//"0x2E4621E682272680AEAB78f48Fc0099CED79e7d6"
function sendOrderR(entryPoint,beneficiary,ops){
    return  useAxiosStore().axios({
        httpUrl:"bundler",
        mode:"http", 
        target:"/tyche/api/transact",
        method:"post",
        data:{
            "address":entryPoint,
            "method": "handleOps",
            "args": {
               "ops": [ops],
               "beneficiary":beneficiary 
            }
         }
     });
}

function getOrderR(orderID){
    return  useAxiosStore().axios({
        httpUrl:"bundler",
        mode:"http", 
        target:"/tyche/api/order/get",
        loop:5,
        method:"post",
        data:{
            "orderID": String(orderID)
        }
     }); 
}

function getFeeDataR(){
    return  useAxiosStore().axios({
        httpUrl:"bundler",
        mode:"http", 
        target:"/tyche/api/gasPrice",
        loop:5,
        method:"get",
        data:{}
     });  
}

function getVaultNonceR(vault){
    return  useAxiosStore().axios({
        mode:"chainBlockCall",  
        target:"@EntryPoint",
        loop:5,
        method:"getNonce",
        data:{
          param:{
             "address":vault,
             "uint192":0
          },
          returnsType:{
             "uint256":"nonce"   
          }         
    }});
}


function getVaultR(wallet,salt){
    return  useAxiosStore().axios({
        mode:"chainBlockCall",  
        target:"@VaultFactory",
        loop:5,
        method:"getAddress",
        data:{
          param:{
             "address":wallet,
             "uint256":salt
          },
          returnsType:{
             "address":"vault"   
          }         
    }});
}

function getVaultMaxSaltR(wallet){
    return  useAxiosStore().axios({
        mode:"chainBlockCall",  
        target:"@VaultFactory",
        loop:5,
        method:"getVaultMaxSalt",
        data:{
          param:{
             "address":wallet
          },
          returnsType:{
             "uint256":"maxSalt"   
          }         
    }});
}

function getAllVaultLengthR(wallet){
    return  useAxiosStore().axios({
        mode:"chainBlockCall",  
        target:"@VaultFactory",
        loop:5,
        method:"getAllVaultLength",
        data:{
          param:{
             "address":wallet
          },
          returnsType:{
             "uint256":"maxSalt"   
          }         
    }}); 
}

export {sendOrderR,getOrderR,getVaultR,getVaultMaxSaltR,getVaultNonceR,getFeeDataR,getAllVaultLengthR}

