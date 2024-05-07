import { defineStore } from 'pinia'
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/vue'
import {polygon} from "@/config/chainBlock/polygon"
import {arbitrum} from "@/config/chainBlock/arbitrum"
import {useAxiosStore} from "./axios"
import {useRouteStore} from "./route"
import { ethers } from 'ethers'
let eth={
  chainId: 1,
  name: "ethereum",
  currency: "ETH",
  explorerUrl: "https://etherscan.io",
  rpcUrl: "https://cloudflare-eth.com",
}
export const useModalStore = defineStore('modal', {
  state:()=>({
    projectId:'f47863c3ad29e5bae9cee8013ec05982',//云项目id
    modal:null,
    allowChain:[arbitrum,polygon],

  }),
  actions: {
     initModal(){   
        // 3. Create modal
        const metadata = {
            name: 'My Website',
            description: 'My Website description',
            url: 'https://mywebsite.com', // origin must match your domain & subdomain
            icons: ['https://avatars.mywebsite.com/']
        }  
        //创造modal    
        const modal = createWeb3Modal({
            // termsConditionsUrl:"http://www.baidu.com",//条款和条件链接的url
            // privacyPolicyUrl:"https://www.google.com/",//隐私政策链接url
            featuredWalletIds:["2a3c89040ac3b723a1972a33a125b1db11e258a6975d3a61252cd64e6ea5ea01"],//默认钱包
            ethersConfig: defaultConfig({ metadata }),
            chains: [polygon.chainInfo,arbitrum.chainInfo,eth],
            projectId:this.projectId,
            enableAnalytics: true, // 云数据分析
            allWallets:"SHOW", //控制移动钱包显示 HIDE 不显示  ONLY_MOBILE 只在移动端显示  SHOW 全部显示
            themeMode:"light", //设置主题 light 亮  dark 暗
            tokens: {
              1: {
                address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
                image: 'token_image_url' //optional
              },
              137: {
                address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
                image: 'token_image_url' //optional
              }
            },
            customWallets: [
              // {
              //   id: '195225',
              //   name: 'SEIWallet',
              //   homepage: 'https://metamask.io/', // Optional
              //   image_url: 'https://www.baidu.com/img/flexible/logo/pc/result.png', // Optional
              //   mobile_link: 'http://www.baidu.com', // Optional - Deeplink or universal
              //   desktop_link: 'http://www.baidu.com', // Optional - Deeplink
              //   webapp_link: 'http://www.baidu.com', // Optional
              //   app_store: 'app_store', // Optional
              //   play_store: 'play_store' // Optional
              // }
            ]
        })
        this.modal=modal
        this.modal.subscribeProvider(handleChange)      
     }  
  }
})

// 定义订阅事件
function handleChange({provider, providerType, address, error, chainId, isConnected }) { 
     console.log("事件触发",provider, providerType, address, error, chainId, isConnected)
    
    
     //重新初始化axios
     if(isConnected){
        if(checkChain(chainId))return true;      
        //真正的链接
        const axiosStore=useAxiosStore();
        let chainBlockCallProvider=  new ethers.providers.Web3Provider(provider)
        console.log(chainBlockCallProvider,"---+++----")
        axiosStore.initProvider(chainBlockCallProvider,provider,address)
        axiosStore.setChainId(chainId)
        axiosStore.setCurrentAccount(address)   
        axiosStore.setIsConnect(3)
        axiosStore.setCurrentProvider(chainBlockCallProvider)
        axiosStore.setIsWalletChange(1)
        return
     }
     clearChain()
}
//检查是否链接正确
function checkChain(chainId){      
        //判断当前链项目是否支持
        const modalStore=useModalStore();
        let allowChain=  modalStore.allowChain
        let isExistChain=false
        allowChain.forEach(item=>{
              if(item?.chainInfo?.chainId==Number(chainId)){
                  isExistChain=true
              }
        })
        if(!isExistChain){
             clearChain()
            let routeStore=useRouteStore()
            routeStore.setChangeRoute("/networkError")
           return
        }
        return false
}
//清除相关信息
function clearChain(){
  const axiosStore=useAxiosStore();
  axiosStore.initProvider(null,null,ethers.constants.AddressZero)
  axiosStore.setChainId(-1)
  axiosStore.setCurrentAccount(ethers.constants.AddressZero)   
  axiosStore.setIsConnect(1)
  axiosStore.setCurrentProvider(null)
  axiosStore.setIsWalletChange(1)
}

  

