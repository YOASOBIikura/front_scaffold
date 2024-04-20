import { useAxiosStore } from "@/pinia/modules/axios";

//获取订单信息 chainId 链id businessType 业务类型 collateralAsset 抵押资产
function getOrderApi(chainId,businessType,collateralAsset){
     return  useAxiosStore().axios({
        mode:"http", //chainBlockCall  http  chainBlockSend  sign  unSign  
        target:"/api/orders" ,// chainBlock 时是合约地址   http时是url
        loop:5,//填5 尝试5次   infinite 无限
        // method:"get" //请求方式  http时 填get   rpc 填方法
        method:"get",
        data:{
         // "populate[0]":"network.icon",
         "populate[1]":"collateral_token.network.icon",
         "populate[2]":"collateral_token.icon",
         "populate[3]":"collateral_token.types",
         "populate[4]":"loan_token.network.icon",
         "populate[5]":"loan_token.icon",
         "populate[6]":"loan_token.types",
         "populate[7]":"vault.positions.token.types",
         "populate[8]":"vault.positions.token.icon",
         "populate[9]":"vault.positions.token.network",
         "pagination[start]":0,
         "pagination[limit]":100000,
         "pagination[withCount]":false,
         "filters[business_type]":businessType,
         "filters[collateral_token][address]":collateralAsset,   
         "filters[network][chainId]":chainId,
         "filters[vault][vault_type]":"loaner",
         "sort[0]":"end_time%3Aasc",
         "sort[1]":"exercise_price%3Aasc"   
        }
     });

}
//获取行权价  tokenSymbol 代币的symbol
function getOptionPremiumPriceApi(tokenSymbol,expireDate){
   return  useAxiosStore().axios({
      mode:"http", 
      target:"/api/option-datas",
      loop:5,
      method:"get",
      data:{
         "filters[quote_symbol][$eq]":tokenSymbol,
         "filters[datetime]":expireDate,
         "pagination[limit]":"100000",
         "pagination[start]":"0"
      }
   });  
}

//生成call订单
function  createCallOrderApi(callOrder){
   return  useAxiosStore().axios({
      mode:"http", 
      target:"/api/orders/",
      loop:5,
      method:"post",
      data:callOrder
   });  
}

// {
//    "data": {
//       "collateral_token": 2,
//       "interest": "0",
//       "loan_token": 4,
//       "network": 1,
//       "status": "pending",
//       "start_time": 1709769600000,
//       "end_time": 1735272000000,
//       "creator_name": "test",
//       "name": "test offer",
//       "type": "offer",
//       "ltv": "0",
//       "exercise_price": 1800,
//       "interest_rate_delta": "0",
//       "interest_amount_delta": "0",
//       "interest_type": "regular",
//       "interest_regular_type": "exercise_price",
//       "business_type": "call_option",
//       "max_threshold": "0.2",
//       "option_premium_rate_delta": 0.005,
//       "vault": "0x5962EA3d0a38377928f596937dE5aA655Fddf5A0"
//   },
//   "meta": {}
// }


export {getOrderApi,getOptionPremiumPriceApi,createCallOrderApi}

