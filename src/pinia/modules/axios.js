import { defineStore } from 'pinia'
import { useWeb3Modal,useWeb3ModalState } from '@web3modal/ethers5/vue'
import Axios from "@/plugin/axios/axios"
import {polygon} from "@/config/chainBlock/polygon"
import {arbitrum} from "@/config/chainBlock/arbitrum"
import { BigNumber, ethers } from 'ethers'

export const useAxiosStore = defineStore('axios', {
  state:()=>({
    axios:null,
    chainId:-1,
    currentAccount:ethers.constants.AddressZero,
    isConnect:1,//是否链接钱包  1完成未链接  2 只有发交易时才链接  3 完全链接
    currentContractData:{}, //钱包是那条链 这里就是那条链的项目合约
    bundlerUrl:"",//钱包是那条链 这里就是那条链的bundlerUrl
    currentProvider:null,  //钱包provider
    currentTokens:[],// 当前tokenList
    remark:{},//辅助额外信息
    optionBusiness:{},
    chainInfo: {}, // 当前链的信息相关数据
   //--是否触发钱包相关事件--
   isWalletChange:1,
   vaultSalt:BigNumber.from("0"),//vault下标
  }),
  getters: {
 
  },
  actions: { 
     //第一次初始化
     initAxios(chainBlockCallProvider,chainBlockSendProvider,wallet){
         this.axios= new Axios({
            // httpUrl:"http://192.168.3.31:8000",
            httpUrl: import.meta.env.VITE_APP_API_URL,
            chainBlockCallProvider:chainBlockCallProvider,
            chainBlockSendProvider:chainBlockSendProvider,
            safeBlock:6,
            loop:5,
            headers:{
              "Content-Type":"application/json"
            },
            wallet:wallet
         })
         setInterceptors(this.axios)
     }, 
     initProvider(chainBlockCallProvider,chainBlockSendProvider,wallet){
         this.axios.chainBlockCallProvider=chainBlockCallProvider
         this.axios.chainBlockSendProvider=chainBlockSendProvider
         this.axios.wallet=wallet
     },
     setChainId(chainId){ 
      this.chainId=chainId
      switch(Number(chainId)){
          case 137:
            this.currentContractData=polygon.contractData
            // this.bundlerUrl=polygon.bundlerUrl
            this.bundlerUrl = import.meta.env.VITE_POLYGAN_BUNDLER_URL;
            this.currentTokens=polygon.tokens
            this.remark=polygon.remark
            this.optionBusiness=polygon.optionBusiness
            this.chainInfo = polygon.chainInfo
            this.axios.safeBlock = polygon.remark.safeBlock;
            this.axios.loop = polygon.remark.loop;
            break
          case 42161:
             this.currentContractData=arbitrum.contractData
            //  this.bundlerUrl=arbitrum.bundlerUrl;
             this.bundlerUrl = import.meta.env.VITE_ARBITRUM_BUNDLER_URL;
             this.currentTokens=arbitrum.tokens
             this.remark=arbitrum.remark
             this.optionBusiness=arbitrum.optionBusiness
             this.chainInfo = arbitrum.chainInfo
             this.axios.safeBlock = arbitrum.remark.safeBlock;
             this.axios.loop = arbitrum.remark.loop;
             break;       
      }
     },
     setCurrentAccount(newAccount){
        this.currentAccount=newAccount
     },
     setIsConnect(isConnect){
        this.isConnect=isConnect
     },
     setCurrentProvider(provider){
        this.currentProvider=provider
     },
     setIsWalletChange(newVal){
        this.isWalletChange+=newVal
     },
     //-------------业务辅助----------------------
     getTokenByName(name){
         let token={}
         this.currentTokens.forEach(item=>{
             if(item.name==name){
               token=item
             }
         })
         return token
     },
     getTokenByAddress(address){
      let token={}
      this.currentTokens.forEach(item=>{
          if(String(item.address).toLocaleLowerCase()==String(address).toLocaleLowerCase()){
            token=item
          }
      })
      return token
     },

  }
})

//拦截器
function  setInterceptors(axios){
    requestInterceptors(axios)
    responseInterceptors(axios);

}

//睡眠阻塞器
function sleep(ms) {
   return new Promise(resolve => setTimeout(resolve, ms));
}

//_this 请只读 别修改 因为当前请求修改_this会影响到下次请求
//请求拦截器
function requestInterceptors(axios){
    //判断当前钱包是否登录
    axios.interceptors.request.use(async function(_this,option){
      let axiosStore=useAxiosStore()
      // console.log("请求拦截器(拦截chainBlockCall 和 chainBlockSend请求)")
      if(
        // option.mode == "chainBlockCall" || 
      option.mode == "chainBlockSend" || 
      option.mode== "sign" || 
      option.mode== "sign712" ||
       option.mode== "unSign" || 
       option.mode== "switchChain" ||
       option.httpUrl == "bundler"
       ){          
         if(!_this.chainBlockCallProvider || !_this.chainBlockSendProvider || axiosStore.isConnect!=3){
              while(axiosStore.isConnect!=3 && !axiosStore.currentProvider){
                  //链接钱包
                 var { open, selectedNetworkId } = useWeb3ModalState()
                 if(!open){
                   var { open, close } = useWeb3Modal()
                   open({view: 'Networks'})
                 }
                 //每2.5秒检测一下是否登录
                 await sleep(2500)
               }  
               //    return {
               //       status:false,
               //       message:"not connect wallet"
               // }
         }
      }

      return true
   })



    //拦截器(拦截区块链信息)
    axios.interceptors.request.use(async function(_this,option){
         //做各条链的适配
         if(option.mode == "chainBlockCall" || option.mode == "chainBlockSend"){
            let axiosStore=useAxiosStore()
             //修改target
             let target=option.target
             let key=String(target).split("@")[1]
            
            //  console.log("替换key",key,axiosStore.currentContractData)
             if(key){    
               option.target= axiosStore.currentContractData[key]
             }
             //修改在multiCall情况下 contracts字段        
             if(option.method && option.method == "multiCall"){
                 let contracts=option.data.contracts
                 for(let i=0;i<contracts.length;i++){                
                    let contractsKey=String(contracts[i]).split("@")[1]
                    if(contractsKey){
                     contracts[i]=axiosStore.currentContractData[contractsKey]
                    }                
                 }
             }
         }
         // console.log(_this,option,"请求拦截器")
         return true
            
        
       }
    )
    //拦截http请求信息
    axios.interceptors.request.use(async function(_this,option){
      //   console.log("请求拦截器(拦截http请求)")
        //处理bunlder的url 
        if(option.mode == "http" && option.httpUrl == "bundler"){
          let axiosStore=useAxiosStore() 
          option.httpUrl=axiosStore.bundlerUrl
        }
        return true
    })

}
//响应拦截器
function responseInterceptors(axios){
    //拦截错误信息
    axios.interceptors.response.use(function(response,option,_this){
        //错误拦截  链上错误拦截
        if(response.status == _this.statusFail){
            console.log("错误拦截",response)
        }
        return response;
     })  
    
    axios.interceptors.response.use(function(response,option,_this){
      // console.log(response,"响应拦截器2")
      return response;

    })
}