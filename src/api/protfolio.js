import { useAxiosStore } from "@/pinia/modules/axios";

function getMyOfferApi(_chainId,_wallet){
    return useAxiosStore().axios({
        mode:"http", //chainBlockCall  http  chainBlockSend  sign  unSign  
        target:"/option/offer_list" ,// chainBlock 时是合约地址   http时是url
        loop:5,//填5 尝试5次   infinite 无限
        // method:"get" //请求方式  http时 填get   rpc 填方法
        method:"get",
        data:{
            "chain_id":String(_chainId),
            "owner_address":_wallet    
          }
    })
}

export {getMyOfferApi}
