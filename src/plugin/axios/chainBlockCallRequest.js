import {parseRequest,parseResponse,makeHex} from "./chainBlockUtils"
//链上查询请求
async function chainBlockCallRequest(_this,option){
   if( !option.data || !option.data.param) {
      throw  new Error("lack field param")
   } 
   if(!option.data|| !option.data.returnsType){
      throw  new Error("lack field returnsType")
   }
   if(!option.method){
       throw new Error("lack field method")
   }
   if(!option.target){
      throw new Error("lack field target")
   }
   //如果查询是multicall的情况下 就走multiCall
   if(option.method == "multiCall"){
      return multiCall(_this,option)
   }    
   //复制一份请求信息
   let arg=JSON.parse(JSON.stringify(option.data));
   let request=parseRequest(arg.param)
   let responseHex=await callConrtact(_this,option,request.argType,request.argValue)
   let response= parseResponse(responseHex,arg.returnsType)
   // console.log(response,"----")
   return {
      status:_this.statusSuccess,
      message:response
   }; 
}
//真正的链上请求
async function callConrtact(_this,option,paramType,param){

    let dataHex= makeHex(option.method,paramType,param)
    let result=_this.chainBlockCallProvider.call({
      to:option.target,
      data:dataHex
     })

    return result; 
}

//multiCall 多查询
async function multiCall(_this,option){
   if(!option.data || !option.data.contracts){
      throw  new Error("lack field contracts")
   }
   if(!Array.isArray(option.data.contracts) ){
      throw new Error("field contracts must be array")
   }
   if(!Array.isArray(option.data.param)){
      throw new Error("field param must be array")
   }
   if(!Array.isArray(option.data.returnsType)){
      throw new Error("field returnsType must be Array")
   }
   let param={}
   param["address[]"]=option.data.contracts
   let hexList=[]
   for(let i=0;i<option.data.param.length;i++){
      if(!option.data.param[i].param){
         throw new Error("lack field param")
      }
      let request= parseRequest(option.data.param[i].param)
      if(!option.data.param[i].func){
         throw new Error("lack field func")
      }
      let dataHex= makeHex(option.data.param[i].func,request.argType,request.argValue)
      hexList.push(dataHex)
   }
   param["bytes[]"]=hexList
   //正式解析上链请求
   let request2=parseRequest(param)
   let realParam= makeHex(option.method,request2.argType,request2.argValue)
   let result=await _this.chainBlockCallProvider.call({
      to:option.target,
      data:realParam
   })
   let returnsType={
       "bytes[]":"multResult"
   }
   let response= parseResponse(result,returnsType)
   let responseList=[]
   for(let i=0;i<option.data.returnsType.length;i++){
       let realResponse=parseResponse(response.multResult[i],option.data.returnsType[i])
       responseList.push(realResponse)
   }
   // console.log(result,"请求结果",response)
   return {
      status:_this.statusSuccess,
      message:responseList
   };
}

 export {chainBlockCallRequest}