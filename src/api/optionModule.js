import { useAxiosStore } from "@/pinia/modules/axios";

function  setSigatureLockApi(_vault,_orderType,_underlyingAsset,_timestamp){
    return  useAxiosStore().axios({
        mode:"chainBlockSend", 
        target:"@OptionModule",
        method:"setSigatureLock",
        data:{
          param:{
             "address:1":_vault,
             "uint8:2":_orderType,
             "address:3":_underlyingAsset,
             "uint256:4":_timestamp
          },  
    }});
}

//签712订单
function sign712OrderApi(chainId,OptionPutModule,signatureInfo){
    return useAxiosStore().axios({
        mode:"sign712",
        data:{
           domain:{
            name: "jasperVault",
			version: "2.0.0",
			chainId: chainId,
            verifyingContract:OptionPutModule
           },
           primaryType:"Signature",
           types:{ 
            EIP712Domain:[
             {name:'name', type:'string'},
             {name:'version', type:'string'},
             {name:'chainId',type :'uint256'},
             { name : 'verifyingContract' , type : 'address'}],
             Signature:[
                {type:"uint8", name:"orderType"},
                {type:"address",name:"underlyingAsset"},
                {type:"uint8", name:"underlyingAssetType"},
                {type:"uint256", name:"underlyingNftID"},
                {type:"uint256", name:"expirationDate"},
                {type:"uint256", name:"total"},
                {type:"uint256", name:"timestamp"},
                {type:"uint8[]", name:"liquidateModes"},
                {type:"address[]", name:"strikeAssets"},
                {type:"uint256[]", name:"strikeAmounts"},
                {type:"address[]", name:"premiumAssets"},
                {type:"uint256[]", name:"premiumFees"}
            ]
           },
           message:signatureInfo
        }
     })
}

/**
 * 
    function liquidateOption(
        IOptionFacet.OrderType _orderType,
        uint64 _orderID,
        LiquidateType _type,
        uint256 _incomeAmount,
        uint256 _slippage
    ) external
 * 
 */

// 清算 
function liquidateOptionApi(orderType,orderId,liquidateType,incomeAmount,slippage){
    return  useAxiosStore().axios({
        mode:"chainBlockSend", 
        target:"@OptionService" ,
        method:"liquidateOption",
        data:{
          value:0,
          param:{
             "uint8":orderType,
             "uint64":orderId,
             "uint8":liquidateType,
             "uint256":incomeAmount,
             "uint256":slippage
          }  
    }});
}

//获取行权价
function getStrikeApi(_symbol,_type,_priceList,_marketPrice ){
    return  useAxiosStore().axios({
        mode:"http", //chainBlockCall  http  chainBlockSend  sign  unSign  
        target:"/option_dates/all_dates" ,// chainBlock 时是合约地址   http时是url
        loop:5,//填5 尝试5次   infinite 无限
        // method:"get" //请求方式  http时 填get   rpc 填方法
        method:"post",
        data:{
            quote_symbol:String(_symbol).toLocaleUpperCase(),
            option_type:_type,
            price_list:_priceList,
            market_price:_marketPrice,
            discount_factor:"0"
        }
     });
}


//创建订单
function createOrderApi(info){
    return  useAxiosStore().axios({
        mode:"http", //chainBlockCall  http  chainBlockSend  sign  unSign  
        target:"/option/" ,// chainBlock 时是合约地址   http时是url
        loop:1,//填5 尝试5次   infinite 无限
        // method:"get" //请求方式  http时 填get   rpc 填方法
        method:"post",
        data:info
     });
}

//获取订单

function getOrderApi(id){
    return  useAxiosStore().axios({
        mode:"http", //chainBlockCall  http  chainBlockSend  sign  unSign  
        target:`/option/${id}` ,// chainBlock 时是合约地址   http时是url
        loop:1,//填5 尝试5次   infinite 无限
        // method:"get" //请求方式  http时 填get   rpc 填方法
        method:"put",
        data:{}
     });
}


export {setSigatureLockApi,sign712OrderApi,liquidateOptionApi,getStrikeApi,createOrderApi,getOrderApi}
