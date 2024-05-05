import { useAxiosStore } from "@/pinia/modules/axios";

function getOfferApi(_optionId,_chainId,_wallet, _page = 1, _pageSize = 10){
    return useAxiosStore().axios({
        mode:"http", //chainBlockCall  http  chainBlockSend  sign  unSign  
        target:"/option/offer_list" ,// chainBlock 时是合约地址   http时是url
        loop:5,//填5 尝试5次   infinite 无限
        // method:"get" //请求方式  http时 填get   rpc 填方法
        method:"post",
        data:{
            "offer_id": _optionId,
            "owner_address": _wallet,
            "chain_id": String(_chainId),
            "page": {
              "page": _page,
              "page_size": _pageSize
            }
          }
    })
}


function getOrderApi(_optionId,_chainId,_wallet,_filterType=[],_status=[],_sort=0, _page = 1, _pageSize = 10){
  return useAxiosStore().axios({
    mode:"http", //chainBlockCall  http  chainBlockSend  sign  unSign  
    target:"/order/order_list" ,// chainBlock 时是合约地址   http时是url
    loop:5,//填5 尝试5次   infinite 无限
    // method:"get" //请求方式  http时 填get   rpc 填方法
    method:"post",
    data:{
      "order_id": _optionId,
      "owner_address": _wallet,
      "chain_id":String(_chainId),
      "filter_type": _filterType,
      "status": _status,
      "sort": _sort,
      "page": {
        "page": _page,
        "page_size": _pageSize
      }
    }
})
}


export {getOfferApi,getOrderApi}
