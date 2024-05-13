import { useAxiosStore } from "@/pinia/modules/axios";


function  issueApi(_vault,_from,_assets,_amounts,_value){
    return  useAxiosStore().axios({
        mode:"chainBlockSend", 
        target:"@IssuanceModule",
        method:"issue",
        estimateGas:true,
        data:{
          value:_value,
          param:{
             "address:1":_vault,
             "address:2":_from,
             "address[]:3":_assets,
             "uint256[]:4":_amounts
          },  
    }});
}

export {issueApi}