import { useAxiosStore } from "@/pinia/modules/axios";
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
        method:"get",
        data:{}
     });  
}

function getVaultNonceR(vault){
    return  useAxiosStore().axios({
        mode:"chainBlockCall",  
        target:"@EntryPoint",
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

