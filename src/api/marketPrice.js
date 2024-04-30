import { useAxiosStore } from "@/pinia/modules/axios";


//获取参数列表
function getMarketPriceApi(_chainId,_orderType,_assetSymbol){
    return  useAxiosStore().axios({
        mode:"http", //chainBlockCall  http  chainBlockSend  sign  unSign  
        target:"/option_dates/market_dates" ,// chainBlock 时是合约地址   http时是url
        loop:5,//填5 尝试5次   infinite 无限
        // method:"get" //请求方式  http时 填get   rpc 填方法
        method:"post",
        data:{
            "page": {
              "page": 1,
              "page_size": 10000
            },
            "quote_symbol":String(_assetSymbol).toLocaleUpperCase(),
            "option_type": _orderType,
            "status": 1,
            "chain_id":String(_chainId)
          }
     });
}

//获取offer  
function getMarketOfferApi(_chainId,_orderType,_assetSymbol,_strikeprice,_optionDate,_wallet){
    return useAxiosStore().axios({
        mode:"http", //chainBlockCall  http  chainBlockSend  sign  unSign  
        target:"/option/market_offer" ,// chainBlock 时是合约地址   http时是url
        loop:5,//填5 尝试5次   infinite 无限
        // method:"get" //请求方式  http时 填get   rpc 填方法
        method:"post",
        data:{
             "page": {
                  "page": 1,
                  "page_size": 10000
                },
                "quote_symbol": String(_assetSymbol).toLocaleUpperCase(),
                "option_type": _orderType,
                "chain_id":String(_chainId),
                "status": 1,
                "strike_price": String(_strikeprice),
                "option_date": String(_optionDate),
                "writer_wallet":_wallet
              
          }
    })
}


export {getMarketPriceApi,getMarketOfferApi}