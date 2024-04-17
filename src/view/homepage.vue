
<template>
    <div>homepage ----{{$t('message.hello',{count:6})}}</div>
    <button @click="switchLanguage">切换语言</button>
    <button @click="modalStore.modal.open()">Open Connect Modal</button>
    <button @click="modalStore.modal.open({ view: 'Networks' })">Open Network Modal</button>
    <button @click="close">断开链接</button>
    <button @click="switchChain(1)">切换链</button>
    <button @click="switchChain(137)">切换链2</button>
    <button @click="sign()">签名</button>
    <button @click="sign712()">签名712</button>
    <button @click="sendTx">发送交易</button>
    <button @click="sendBundlerTx">发送bundler交易</button>

</template>


<script setup>
import { ref } from 'vue'
import {useAxiosStore} from "@/pinia/modules/axios"
import {testChainBlock,testHttp,testSend,testGet,testSwitchNetwork,testSign,testUnSign,testSign712,testMultiCall} from "@/api/test"
import { useModalStore } from '@/pinia/modules/modal';
import {ethers} from "ethers"
import {useI18n} from "vue-i18n"

import {sendTxToBundler}  from "@/plugin/bundler"


// async function get3(){
//     const provider = new ethers.providers.JsonRpcProvider(" https://evm-rpc-arctic-1.sei-apis.com");
// console.log(provider)
// let obj= await  provider.getFeeData()
// console.log(obj,"--帅哥--")
// }
// get3()

// 


const {locale} =useI18n()

var sendBundlerTx=()=>{
    sendTxToBundler([],[],[]).then(res=>{
        console.log(res)
    })
}



var switchLanguage=()=>{
     if(locale.value=="en"){
          locale.value="zh"
     }else{
         locale.value="en"
     }
}


//   testChainBlock().then(res=>{
//       console.log(res,"homepage结果 call chainBlock")
//  })


//钱包链接
  let   modalStore= useModalStore()


 var close=()=>{
    //内部做的管理机制
    console.log(modalStore.modal.disconnect(),"断开链接")
    
 }

 var sendTx=()=>{
    testSend().then(res=>{
      console.log("homepage",res)
    })
 }

setTimeout(()=>{

    // testHttp().then(res=>{
    //  console.log(res,"http的结果") 
    // })

    testGet("0x5bF89C0d73eD1c3687CadEbB6702Ce55dA42Db17").then(res=>{
         console.log("testGet",res)
    })
    testMultiCall().then(res=>{
         console.log(res,"MultiCall")
    })
},1500)
var switchChain=(chainId)=>{
    testSwitchNetwork(chainId).then(res=>{
         console.log(res,"----")
    })
}

var sign=()=>{
    testSign().then(res=>{
         console.log(res,"签名是 ")
         testUnSign(res.message).then(res=>{
             console.log("解签结果",res)
         })
    })
}

var sign712=()=>{
    testSign712().then(res=>{
        console.log(res,"712签名数据")
    })
}
</script>


<style scoped>
</style>
