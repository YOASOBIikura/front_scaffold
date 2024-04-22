import { useAxiosStore } from "@/pinia/modules/axios";

function getVaultApi(wallet,salt){
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

function getVaultMaxSaltApi(wallet){
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

function getAllVaultLengthApi(wallet){
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



function getVaultMaxSaltAddressApi(wallet){
    return  useAxiosStore().axios({
        mode:"chainBlockCall",  
        target:"@VaultFactory",
        method:"getVaultMaxSaltAddress",
        data:{
          param:{
             "address":wallet
          },
          returnsType:{
             "address":"vault"   
          }         
    }});  
}

export {getVaultApi,getVaultMaxSaltApi,getAllVaultLengthApi,getVaultMaxSaltAddressApi}