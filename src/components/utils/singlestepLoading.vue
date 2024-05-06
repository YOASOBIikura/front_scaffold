<template>
    <a-drawer
        v-if="props.isOpen" 
        class="tranfer-title"  
        :height="currentHeight"
        :closable="false" 
        :headerStyle="{padding:'0px'}" 
        :bodyStyle="{padding:'0px'}" 
        :placement="'bottom'"   
        :open="props.isOpen"  
        @close="closeDrawer"
        :maskClosable="canClose"
    >
        <template v-slot:title>
             <div class="transfer-title">
                 <span class="title">{{props.transferName}}</span>
                 <img v-if="canClose"  class="close" src="@/assets/images/close.png" alt="" @click="closeDrawer">
             </div>
        </template>
        <div class="loading-content">
            <div class="loading" v-if="props.status === 'pending'">
                <img src="@/assets/images/loading.png" class="loading-img animation"/>
                <div class="loading-title">{{ props.transferName }}</div>
                <div class="loading-info">Your transfer is underway and will be completed in 22-30minutes. Once completed, your token balance will be automatically updated.</div>
            </div>
            <div class="loading" v-else-if="props.status === 'success'">
                <img src="@/assets/images/loading-success.png" class="loading-img"/>
                <div class="success-title">Your transaction is successfully completed</div>
                <a-button 
                    type="primary" 
                    class="btn-go"
                    @click="goToNextPage"
                >Go to {{props.nextPage.name}}</a-button>
                <a-button class="btn-view" @click="viewOnScan">View on {{scanName}}</a-button>
            </div>
            <div class="loading" v-else-if="props.status === 'faild'">
                <img src="@/assets/images/loading-faild.png" class="loading-img"/>
                <div class="success-title">Transaction failed.</div>
                <a-button 
                    type="primary" 
                    class="btn-go"
                    @click="closeDrawer"
                >Close</a-button>
                <a-button class="btn-view" v-if="props.hash" @click="viewOnScan">View on {{scanName}}</a-button>
            </div>

           
        </div>
    </a-drawer>
</template>
<script setup>
import {computed} from "vue"
import {useAxiosStore} from "@/pinia/modules/axios";
import { useRouter} from "vue-router";
const axiosStore=useAxiosStore()
const props=defineProps({
    // 是否打开的双向绑定
   isOpen:{
       type:Boolean,
       require:true,
       default:false
   },
   // 交易hash
   hash: {
        type: String,
        default: ""
   },
   status: {
        type: String,
        default: "pending" // pending/faild/success
   },
   // 跳转的下一个页面参数
   nextPage: {
        type: [Object,String],
        require: true,
        default: {
            path: "",
            query: {},
            name: ""
        }
   },
   // 交易的名称，用于显示
   transferName: {
        type: String,
        require:true,
        default: "Transfer in progress"
   }
});
const router = useRouter();

// 弹窗是否可以关闭
const canClose = computed(() => {
    return props.status !== "pending";
})

const scanName = computed(() => {
    return JSON.parse(JSON.stringify(axiosStore.chainInfo.explorerName));
})

const currentHeight = computed(() => {
    let height = 500;
    if(props.status === 'pending'){
        height = 460;
    } else if(props.status === "faild"){
        if(!props.hash){
             height = 460;
        }
    }
    return height;
})

const emits=defineEmits(["update:isOpen"])

var closeDrawer=()=>{
    if(!canClose){
        return
    }
   emits("update:isOpen",false)
}

var viewOnScan = () => {
    let scanUrl = JSON.parse(JSON.stringify(axiosStore.chainInfo.explorerUrl));
    let chainId = JSON.parse(JSON.stringify(axiosStore.chainId));
    switch(chainId){
        case 137:  window.open(`${scanUrl}/tx/${props.hash}`); break;
        case 42161: window.open(`${scanUrl}/${props.hash}`); break;
    }
   
}

// 去下一个页面
var goToNextPage = () => {
    router.push({
        path: props.nextPage.path,
        query: props.nextPage?.query ? props.nextPage?.query : {}
    });
}

</script>
<style lang="less" scoped>
.tranfer-title{
    width: 100%;
    border-top-right-radius: 8px;
    border-top-left-radius: 8px;
    .transfer-title{
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 60px;
        padding: 20px 16px;
        font-size: 16px;
        border-top-right-radius: 8px;
        border-top-left-radius: 8px;
        .close{
            width: 24px;
        }
    }
    .loading-content{
        padding: 50px 12px 0;
        overflow: hidden;
        .loading{
            display: flex;
            flex-direction: column;
            align-items: center;
            .loading-img{
                width: 128px;
            }
            .animation{
                animation: loading 3s linear infinite;
            }
            .loading-title{
                font-size: 16px;
                margin-top: 40px;
            }
            .success-title{
                font-size: 16px;
                margin-top: 40px;
                font-weight: bold;
            }
            .loading-info{
                font-size: 14px;
                margin-top: 24px;
                text-align: center;
                color: var(--text-color-second);
            }
        }
        .btn-go{
            margin-top: 48px;
            width: 100%;
            font-size: 16px;
            height: 48px;
        }
        .btn-view{
            margin-top: 8px;
            width: 100%;
            font-size: 16px;
            height: 48px;
            border: 1px solid var( --text-color-primary);
        }
    }
}
@keyframes loading {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-180deg);
  }
  50%{
    transform: rotate(-360deg);
  }
  75%{
    transform: rotate(-540deg);
  }
  100% {
    transform: rotate(-720deg);
  }
}
</style>