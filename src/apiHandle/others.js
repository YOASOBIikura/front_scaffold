import { getKytApi } from "@/api/others"

// 获取KYT数据状态
var getKytData = async (walletAddress) => {
    let kytResponse = await getKytApi(walletAddress);
    let data = false;
    if(kytResponse.status == 200){
       data = kytResponse.data;
    } else {
       data = false;
    }
    return data;
 }

export { getKytData };