import Interceptors from "./interceptors"
import request from "./request"
/**
  Axios({
      mode:"chainBlockCall", //chainBlockCall  http  chainBlockSend  sign  unSign
      target:"" ,// chainBlock 时是合约地址   http时是url
      headers:{

      },//请求头
      loop:5,//填5 尝试5次   infinite 无限
      method:"get" //请求方式  http时 填get   rpc 填方法
      data:{  //http请求
        param:{}  
      },
      data2:{  //rpc请求
        safeBlock:5,//安全块
        param:[to,value],
        paramType:["address","uint256"],
        returnsType:["bool"]
      }
      data3:{
         safeBlock:5,//安全块
         paramType:["address","uint256"],
         returnsType:{
              name:"bool",
              job:"string"
         }
      }
  })
 */
function Axios(config){
     var _this=this
     _this.wallet=config.wallet || ""
     _this.httpUrl=config.httpUrl  //管http
     _this.chainBlockCallProvider=config.chainBlockCallProvider //管查询
     _this.chainBlockSendProvider=config.chainBlockSendProvider //钱包的provider
     _this.safeBlock=config.safeBlock || 1 //安全块
     _this.loop=config.loop || 0
     _this.headers={}
     _this.statusSuccess=true
     _this.statusFail=false
     _this.delayTime=500
     for(let k in config.headers){
         _this.headers[k]=config.headers[k]
     }
     
     _this.interceptors={
        request:new Interceptors(),
        response:new Interceptors()
     }   
     let proxy=new Proxy(request,{
         /**
            当使用Axios()   拦截此函数
          */
         apply(fn,thisArg,args){
            return _this.request(...args)
         },
         get(fn,key){
            //Axios 需要的东西从这里取,取到的是this上的值
            return _this[key];
         },
         set(fn,key,val){
            //Axios 设置的东西从这里设置,设置到this上
            _this[key] = val;
            return true;
         }
     })
     return proxy     
}

//睡眠阻塞器
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
 }
Axios.prototype.request=async function(option){
    option.internalData={
        request:"",
        currentLoop:0
    }
    //请求拦截器
    let list = this.interceptors.request.list;
    //不能直接改this
    for(let i=0;i<list.length;i++){
        let interceptResult=await list[i](this,option)
        if(typeof interceptResult == "boolean" && interceptResult){
            continue
        }
        if(!interceptResult.status){
            return  new Promise((resolve,reject)=>{
                resolve(interceptResult)
            })
        }
    }
    //处理请求头
    for(let k in this.headers){
        if(!option.headers[k]){
          option.headers[k]=this.headers[k]
        }
   
    }
    // 处理循环请求次数
    if(!option.loop){
        option.loop =option.loop>this.loop ? option.loop:this.loop;
        // option.loop=this.loop
    }

    // 处理安全块
    if(option.data && option.mode == "chainBlockSend" ){
        if(!option.data.safeBlock || this.safeBlock>option.data.safeBlock){
              option.data.safeBlock=this.safeBlock
        }
    }
    return handleRequest(this,option)
}


function handleRequest(_this,option){
    return new Promise((resolve,reject) => {
        //循环请求
        //贮存resolve返回方法
        if(option.internalData.currentLoop==0){
            option.internalData.request=resolve
        }
        option.internalData.currentLoop+=1
        if(option.mode == "chainBlockCall" || option.mode=="http" || option.mode =="chainBlockNormal"){
            if(option.loop !=0 &&option.internalData.currentLoop > option.loop && option.loop != "infinite"){  
                  console.error("request fail",option)
                 throw new Error("request fail")
            }
        }
        request(_this,option).then((response) => {
            //响应拦截器
            let list = _this.interceptors.response.list;
            // console.log("真正的请求发送",response)
            list.forEach((fn) => {
                response = fn(response,option,_this);
            })
            option.internalData.request(response)
        },async (error) => {    
            if(String(error).includes("lack field")){
                console.error(error,option)
                return
            }
            if(option.mode =="chainBlockCall" || option.mode == "http" || option.mode == "chainBlockNormal"){
                //注意下这里的逻辑 todo
                if(option.loop>0){
                    //睡眠0.5s 再请求
                    await sleep(_this.delayTime);
                    await handleRequest(_this,option)
                }    
            }else{
                console.error(error,option)
            }
            
        });
    })
}

export default Axios