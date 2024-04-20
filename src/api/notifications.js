import { useAxiosStore } from "@/pinia/modules/axios";
function getNotificationsApi(_wallet){
    return  useAxiosStore().axios({
       mode:"http", 
       target:"/api/messages",
       method:"get",
       data:{
        "filters[wallet_addr][$eq]":_wallet,
        "filters[status]":"unread",
        "sort[0]":"createdAt%3ADESC"
       }
    });  
 }
 

 export {getNotificationsApi}