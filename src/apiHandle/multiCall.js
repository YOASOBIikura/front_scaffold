import {multiCallApi,multiCallParseApi} from "@/api/multiCall"
// key:"vaultPosition",
// contract:"@Diamond",
// param:"0x00",
// returnType:"0x01",
//结果以设定的key返回    
async function multiCallObjR(data){
    let keyList=[]
    let contractsList=[]
    let paramList=[]
    let returnsTypeList=[]
    for(let i=0;i<data.length;i++){
        keyList.push(data[i].key)
        contractsList.push(data[i].contract)
        paramList.push(data[i].param)
        returnsTypeList.push(data[i].returnType)
    } 
    let response= await multiCallApi(contractsList,paramList,returnsTypeList)

    let result={}
    response?.message?.forEach((item,index)=>{
        result[keyList[index]]=item
    })
    return result
}



//结果以数组返回
async function multiCallArrR(data){
    let keyList=[]
    let contractsList=[]
    let paramList=[]
    let returnsTypeList=[]
    for(let i=0;i<data.length;i++){
        keyList.push(data[i].key)
        contractsList.push(data[i].contract)
        paramList.push(data[i].param)
        returnsTypeList.push(data[i].returnType)
    } 
    let response= await multiCallApi(contractsList,paramList,returnsTypeList)
    return response.message||[]
}

export {multiCallObjR,multiCallArrR}