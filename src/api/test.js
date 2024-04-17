import { BigNumber } from "ethers";
import { useAxiosStore } from "../pinia/modules/axios";

function  testChainBlock(){
   return  useAxiosStore().axios({
        mode:"chainBlockCall", //chainBlockCall  http  chainBlockSend  sign  unSign  
        target:"0x10be685927d58c02f22de700053be109559f08fa" ,// chainBlock 时是合约地址   http时是url
        loop:5,//填5 尝试5次   infinite 无限
        // method:"get" //请求方式  http时 填get   rpc 填方法
        method:"getApp5",
        data:{
          safeBlock:6,  
          param:{
             "tuple":{
                "address":"0xa024c99baf0be55f3755a878e43225bd32291b4a",
                "uint256":BigNumber.from(5),
                "tuple":{
                    "address":"0xa024c99baf0be55f3755a878e43225bd32291b4a",
                    "tuple[]":[{
                        "bool":true
                    }]
                }
             }
          },
          returnsType:{
            "tuple:b1":{
                "address":"addr",
                "uint256":"age",
                "tuple:a1":{
                    "address":"addr2",
                    "tuple[]:list":[{
                        "bool":"status"
                    }]
                }
             }            
          }         
    }});
}

function testHttp(){
    return  useAxiosStore().axios({
        mode:"http", //chainBlockCall  http  chainBlockSend  sign  unSign  
        target:"/tyche/api/order/get" ,// chainBlock 时是合约地址   http时是url
        loop:5,//填5 尝试5次   infinite 无限
        // method:"get" //请求方式  http时 填get   rpc 填方法
        method:"post",
        data:{
           "orderID":"1"      
        }
     });
}

function testSend(){
    return  useAxiosStore().axios({
        mode:"chainBlockSend", //chainBlockCall  http  chainBlockSend  sign  unSign  
        target:"0x595b248c04cddc1226aa0d4de5ae750cec04f960" ,// chainBlock 时是合约地址   http时是url
        loop:5,//填5 尝试5次   infinite 无限
        // method:"get" //请求方式  http时 填get   rpc 填方法
        method:"setData",
        data:{
          safeBlock:6,  
          value:0,
          param:{
             "uint256":22
          },
          returnsType:{
              "uint256":"age"
          }      
    }});
}

function testGet(address){
    return  useAxiosStore().axios({
        mode:"chainBlockCall", //chainBlockCall  http  chainBlockSend  sign  unSign  
        target:"0x595b248c04cddc1226aa0d4de5ae750cec04f960",// chainBlock 时是合约地址   http时是url
        loop:5,//填5 尝试5次   infinite 无限
        // method:"get" //请求方式  http时 填get   rpc 填方法
        method:"getData",
        data:{
          safeBlock:6,  
          param:{
             "address":address
          },
          returnsType:{
             "uint256":"number"   
          }         
    }});
}

function testSwitchNetwork(chainId){
     return useAxiosStore().axios({
        mode:"switchChain",
        data:{
             chainId:chainId
        }
     })
}

function testSign(){
    return useAxiosStore().axios({
        mode:"sign",
        data:{

            param:{
                name:"bob",
                age:18
            }
        }
     })
}
function testSign712(){
    return useAxiosStore().axios({
        mode:"sign712",
        data:{
           domain:{
            name: "Example DApp",
			version: "1.0.0",
			chainId: 137,
            verifyingContract:"0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC"
           },
           primaryType:"Message",
           types:{ 
            EIP712Domain:[
             {name:'name', type:'string'},
             {name:'version', type:'string'},
             {name:'chainId',type :'uint256'},
             { name : 'verifyingContract' , type : 'address'}],

             Message:[{ name : 'contents' , type :'string'}]
           },
           message:{
               contents:"bob"
           }
        }
     })
}

function testUnSign(data){
    return useAxiosStore().axios({
        mode:"unSign",
        data:{
            param:{
                name:"bob",
                age:18
            },
            signData:data
        }
     })
}

function testMultiCall(){
    return  useAxiosStore().axios({
        mode:"chainBlockCall", //chainBlockCall  http  chainBlockSend  sign  unSign  
        target:"@Manager" ,// chainBlock 时是合约地址   http时是url  @字段名 代表变量
        loop:5,//填5 尝试5次   infinite 无限
        method:"multiCall",
        data:{        
          contracts:["@Diamond","@Diamond"],  
          param:[
            {
               func:"getModuleStatus",
               param:{
                  "address":"0xDC66a4E0c00F2ae4F858c2a4804FAF648EBC66C5" 
               }          
            },{
               func:"getEth",
               param:{

               } 
            }
            
        ],
        returnsType:[
            {
             "bool":"status"
            },{
              "address":"eth"
             }
        ]       
    }}); 
}


export {testChainBlock,testHttp,testSend,testGet,testSwitchNetwork,testSign,testUnSign,testSign712,testMultiCall}