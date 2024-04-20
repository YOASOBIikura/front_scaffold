import {getOrderApi,getOptionPremiumPriceApi} from "@/api/homepage"
//数据处理层 获取订单
async function getOrderR(chainId,businessType,collateralAsset){
    let response=  await getOrderApi(chainId,businessType,collateralAsset)
    //对订单信息做处理 
    let result=[]    
    response["data"] &&response["data"].forEach(item=>{ 
        let obj={
            "businessType":item?.attributes?.business_type,//业务类型
            "endTime":item?.attributes?.end_time,//到期日
            "exercisePrice":item?.attributes?.exercise_price,//行权价
            "vault":item?.attributes?.vault?.data?.attributes?.address,//卖家vault地址
            "vaultOwner":item?.attributes?.vault?.data?.attributes?.owner_addr,//卖家的钱包地址
            "vaultType":item?.attributes?.vault?.data?.attributes?.vault_type,//vault类型
            "vaultStatus":item?.attributes?.vault?.data?.attributes?.status,//vault状态
            "receiveAsset":item?.attributes?.loan_token?.data?.attributes?.address,//权利金地址
            "receiveAssetDecimals":item?.attributes?.loan_token?.data?.attributes?.decimals,//精度
            "receiveAssetSymbol":item?.attributes?.loan_token?.data?.attributes?.symbol,
            "receiveAssetName":item?.attributes?.loan_token?.data?.attributes.name,
            "receiveAssetIcon":item?.attributes?.loan_token?.data?.attributes?.icon.data?.attributes?.url,
            "collateralAsset":item?.attributes?.collateral_token?.data?.attributes?.address,
            "collateralAssetDecimals":item?.attributes?.collateral_token?.data?.attributes?.decimals,//精度
            "collateralAssetSymbol":item?.attributes?.collateral_token?.data?.attributes?.symbol,
            "collateralAssetName":item?.attributes?.collateral_token?.data?.attributes?.name,
            "collateralAssetIcon":item?.attributes?.collateral_token?.data?.attributes?.icon.data?.attributes?.url
        }
        result.push(obj)
    })   
    return result;
}


//获取call报价
async  function getCallOptionPremiumPriceApi(tokenSymbol,expireDate,priceKey){
   let response=await getOptionPremiumPriceApi(tokenSymbol,expireDate)
   let result=[]    
   response["data"] &&response["data"].forEach(item=>{
         let call=item?.attributes?.call
         let obj={
            "instrumentName":call[priceKey]?.instrument_name,
            "markPrice":call[priceKey]?.mark_price
         }
         result.push(obj)
   })
   return result
}

//获取put报价
async  function getPutOptionPremiumPriceApi(tokenSymbol,expireDate,priceKey){
    let response=await getOptionPremiumPriceApi(tokenSymbol,expireDate)
    let result=[]    
    response["data"] &&response["data"].forEach(item=>{
          let put=item?.attributes?.put
          let obj={
             "instrumentName":put[priceKey]?.instrument_name,
             "markPrice":put[priceKey]?.mark_price
          }
          result.push(obj)
    })
    return result
}



export {getOrderR,getCallOptionPremiumPriceApi,getPutOptionPremiumPriceApi}