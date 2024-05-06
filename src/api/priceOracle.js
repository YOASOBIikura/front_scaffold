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


function getPriceByServiceApi(_masterSymbol,_quoteSymbol){
   if(!_quoteSymbol){
      _quoteSymbol=""
   }
   return  useAxiosStore().axios({
      mode:"http", 
      target:"/price_oracle/pyth_price_by_api",
      method:"get",
      data:{
        "token_a_symbol":_masterSymbol,
        "_token_b_symbol":_quoteSymbol      
  }});
}

export {getPriceByPriceOracleApi,getPriceByServiceApi}