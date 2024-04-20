import { useAxiosStore } from "@/pinia/modules/axios";

//组合查询 
function multiCallApi(contracts,param,returnsType){
    return  useAxiosStore().axios({
        mode:"chainBlockCall", 
        target:"@Manager",
        method:"multiCall",
        data:{        
          parseMode:false,  
          contracts:contracts,  
          param:param,
          returnsType:returnsType      
      }}); 
}

function multiCallParseApi(contracts,param,returnsType){
    return  useAxiosStore().axios({
        mode:"chainBlockCall", 
        target:"@Manager",
        method:"multiCall",
        data:{        
          parseMode:true,  
          contracts:contracts,  
          param:param,
          returnsType:returnsType      
      }}); 
}


export {multiCallApi,multiCallParseApi}