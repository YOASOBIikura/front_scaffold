import { useAxiosStore } from "@/pinia/modules/axios";

function switchNetworkApi(chainId){
    return useAxiosStore().axios({
       mode:"switchChain",
       data:{
            chainId:chainId
       }
    })
}


//普通解签
function unSignApi(param,data){
    return useAxiosStore().axios({
        mode:"unSign",
        data:{
            param:param,
            signData:data
        }
     })
}
//provider 查询 getBalance  getFeeData getNetwork  getGasPrice  getBlock 等
function getWalletBalanceApi(wallet){
    return  useAxiosStore().axios({
        mode:"chainBlockNormal", 
        method:"getBalance",
        data:{        
          param:[wallet] 
        }}
    )
}
function getContractCodeApi(contract){
    return  useAxiosStore().axios({
        mode:"chainBlockNormal", 
        method:"getCode",
        data:{        
          param:[contract] 
        }}
    )
}



export {switchNetworkApi,unSignApi,getWalletBalanceApi,getContractCodeApi}