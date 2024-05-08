import { useAxiosStore } from "@/pinia/modules/axios";

function getKytApi(walletAddress){
    return  useAxiosStore().axios({
        mode:"http", 
        target:"/kyt/",
        loop:5,
        method:"get",
        data:{
            addr: walletAddress
        }
     }); 
}
export { getKytApi }