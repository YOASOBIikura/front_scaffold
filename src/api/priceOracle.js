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


export {getPriceByPriceOracleApi}