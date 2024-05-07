import { useAxiosStore } from "@/pinia/modules/axios";

function  getPriceByPriceOracleApi(_masterToken,_quoteToken){
    return  useAxiosStore().axios({
        mode:"chainBlockCall", 
        target:"@PriceOracle",
        loop:5,
        method:"getPrice",
        data:{
          param:{
             "address:1":_masterToken,
             "address:2":_quoteToken
          },
          returnsType:{
             "uint256":"price"   
          }         
    }});
}


function getPriceByServiceApi(_chainId,_masterAddress,_quoteAddress="",tokeList=[]){
   if(!_quoteAddress){
      _quoteAddress=""
   }
   return  useAxiosStore().axios({
      mode:"http", 
      target:"/price_oracle/pyth_price",
      method:"post",
      data:{
        "chain_id":_chainId,
        "token_a_addr":_masterAddress,
        "token_b_addr":_quoteAddress,
        "token_list":tokeList   
  }});
}

export {getPriceByPriceOracleApi,getPriceByServiceApi}