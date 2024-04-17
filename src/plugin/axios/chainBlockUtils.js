import { ethers } from "ethers";

//解析请求参数
function parseRequest(obj){
    let argType=[]
    let argValue=[]
    for(let key in obj){
       let tempKey=key.split(":")
        switch(tempKey[0]){
            case "tuple":              
               let resultTuple=  recursionTuple(obj[key]) 
               argType.push(resultTuple["key"])
               argValue.push(resultTuple["value"])
               break;
            case "tuple[]":
               let resultArray=recursionArray(obj[key])
                argType.push(resultArray["key"])
                argValue.push(resultArray["value"])
                break;
            default :
               argType.push(key),
               argValue.push(obj[key])                  
        }
    }
    return {argType,argValue}
}
function recursionTuple(obj){
   let tupleKey="("
   let tupleValue=[]
   for(let key in obj){
     let tempKey=key.split(":")
     switch(tempKey[0]){
         case "tuple":
          let resultTuple=recursionTuple(obj[key])
          tupleKey+=`${resultTuple["key"]},`
          tupleValue.push(resultTuple["value"])
           break 
         case "tuple[]":
           let resultArray=recursionArray(obj[key])
           tupleKey+=`${resultArray["key"]},`
           tupleValue.push(resultArray["value"])
           break  
         default :
          tupleKey+=`${key},`  
          tupleValue.push(obj[key])  
     }  
   }
   tupleKey=tupleKey.slice(0, -1) + ")";
   return {
      key:tupleKey,
      value:tupleValue
   };
}

function recursionArray(obj){
  let tupleKey=""
  let tupleValue=[]
  for(let i=0;i<obj.length;i++){
     let temp=[]
     let result=recursionTuple(obj[i])
     if(i==0){     
        tupleKey+=result["key"]
     }
     temp.push(result["value"])
     tupleValue.push(temp)
  }
  tupleKey=tupleKey.slice(0, -1) + ")[]";
  return {
     key:tupleKey,
     value:tupleValue
  }
}


//---------返回值解析--------------------

//解析返回参数
function parseResponse(response,returnsType){
   let argType=[]  
   let argValue=[]
   for(let key in returnsType){
       let tempKey=key.split(":")
       switch(tempKey[0]){
           case "tuple":              
              let resultTuple=recursionTuple(returnsType[key])
              argType.push(resultTuple["key"])
              argValue.push(resultTuple["value"])
              break;
           case "tuple[]":
               let resultArray=recursionArray(returnsType[key])
               argType.push(resultArray["key"])
               argValue.push(resultArray["value"])
               break;
           default :
              argType.push(key) 
              argValue.push(returnsType[key])               
       }
   }
   //解析链上返回的结果
   var returnData=ethers.utils.defaultAbiCoder.decode(argType,response)   

  let responseData={};
  Object.keys(returnsType).forEach((key,index) => {
     let tempKey=key.split(":")
     switch(tempKey[0]){
        case "tuple":
           responseData[tempKey[1]]=recursionTupleResponse(returnsType[key],returnData[index]) 
          break;
        case "tuple[]":
           responseData[tempKey[1]]=recursionArrayResponse(returnsType[key],returnData[index]) 
          break;
        default:
           console.log()
           responseData[returnsType[key]]=returnData[index];          
     }
  })
   return responseData
}
//处理返回结果是tuple的请求
function recursionTupleResponse(obj,response){
  let newObj={}
  Object.keys(obj).forEach((key,index) => {
      let tempKey=key.split(":")
       switch(tempKey[0]){
         case "tuple":
            let resultObj=recursionTupleResponse(obj[key],response[index])
            newObj[tempKey[1]]=resultObj;
            break;
         case "tuple[]":
            let resultArrObj=recursionArrayResponse(obj[key],response[index])
            newObj[tempKey[1]]=resultArrObj;
            break;
         default:   
           newObj[obj[key]]=response[index];   
       }
  })
  return  newObj;
}
//处理返回参数是tuple[]的请求
function recursionArrayResponse(obj,response){
 let temp=[]
 for(let i=0;i<response.length;i++){
    let resultObj=recursionTupleResponse(obj[0],response[i]) 
    temp.push(resultObj)
 } 
 return temp
}


// ---------组装参数-------------
function makeHex(method,paramType,param){
    var methodName=method+"("
    paramType.forEach((item,index)=>{
       if(index+1==paramType.length){
        methodName+=item
       }else{
        methodName+=item+","
       }
    })
     methodName+=")"
     var methodHex=ethers.utils.hexDataSlice(ethers.utils.id(methodName),0,4)
     var paramHex=ethers.utils.defaultAbiCoder.encode(paramType,param) 
     var dataHex=ethers.utils.hexConcat([methodHex,paramHex])
     return dataHex; 
}
export {parseRequest,parseResponse,makeHex}