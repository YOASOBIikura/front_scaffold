<template>
    <a-drawer
        v-if="props.isOpen"
        class="tranfer-title"  
        :closable="false" 
        :headerStyle="{padding:'0px'}" 
        :bodyStyle="{padding:'0px'}" 
        :placement="'bottom'"   
        :open="props.isOpen"  
        @close="closeDrawer"
        :maskClosable="canClose"
        :height="calcHeight"
    >
    
        <template v-slot:title>
             <div class="transfer-title">
                 <span class="title">{{props.titleName}}</span>
             </div>
        </template>
        <div class="loading-content">
            <div class="loading-row" :class="item.status" v-for="(item,index) in props.stepList" :key="'loading-' + item.name">
                <span>
                    <div class="dot"></div>
                    <div class="line line-down" v-if="index != props.stepList.length - 1"></div>
                    {{ item.name }}
                </span>
                <img src="@/assets/images/loading.png" v-if="item.status === 'current'" class="loading-img animation"/>
                <div class="pending" v-else-if="item.status === 'pending'"></div>
                <img src="@/assets/images/loading-success.png" v-else-if="item.status === 'success'" class="loading-img"/>
                <img src="@/assets/images/loading-faild.png" v-else-if="item.status === 'faild'" class="loading-img"/>
            </div>
            <a-button 
                type="primary" 
                class="btn-go"
                @click="goToNextPage"
                :disabled="!canClose"
                v-if="!showCloseBtn"
            >Go to {{props.nextPage.name}}</a-button>
            <a-button 
                type="primary" 
                class="btn-go"
                @click="closeDrawer"
                v-else
            >Close</a-button>
            
        </div>
    </a-drawer>
</template>
<script setup>
import { reactive,computed } from "vue";
import { useRouter} from "vue-router";
const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false
    },
    // 步骤列表 name: 当前步骤的显示名称 status: pending/faild/success/current hash: 可以为空
    stepList: {
        type: Array,
        default: [
            {name: "approve", status: "success", hash: ""},
            {name: "transfer", status: "current", hash: ""}
        ],
        require: true
    },
    titleName: {
        type: String,
        default: ""
    },
     // 跳转的下一个页面参数
   nextPage: {
        type: Object,
        require: true,
        default: {
            path: "",
            query: {},
            name: ""
        }
   },
})

const router = useRouter();
const emits=defineEmits(["update:isOpen"])
const canClose = computed(() => {
    let flag = true;
    for(let i in props.stepList){
        if(
            props.stepList[i].status === "pending" || 
            props.stepList[i].status === "current"
        ){
           flag = false 
        }
    }
    return flag;
});

const showCloseBtn = computed(() => {
    let flag = false;
    for(let i in props.stepList){
        if(
            props.stepList[i].status === "faild" 
        ){
           flag = true 
        }
    }
    return flag;
});
const calcHeight = computed(() => {
    return 240 + (props.stepList.length * 55);
});


// 去下一个页面
var goToNextPage = () => {
    router.push({
        path: props.nextPage.path,
        query: props.nextPage?.query ? props.nextPage?.query : {}
    });
}

var closeDrawer=()=>{
    if(!canClose){
        return
    }
   emits("update:isOpen",false)
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
        justify-content: center;
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
}
.loading-content{
    padding: 20px 12px 0;
    overflow: hidden;
    .loading-row{
        padding: 4px 16px;
        margin-top: 16px;
        font-size: 16px;
        line-height: 36px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        .dot{
            width: 14px;
            height: 14px;
            border: 3px solid #DEDEDE;
            display: inline-block;
            border-radius: 100%;
            margin-right: 4px;
            vertical-align: middle;
        }
        .line{
            width: 2px;
            height: 47px;
            background-color: #DEDEDE;
            position: absolute;
            left: 22px;
            &.line-down{
                bottom: -34px;
            }
            
        }
        &.success{
            .dot{
              border: 5px solid #000000;  
            }
            .line{
                background-color:  #000000;
            }
        }
        &.faild{
            .dot{
              border: 5px solid #E37318;  
            }
            // .line{
            //     background-color:  #E37318;
            // }
            
        }
        .loading-img{
            width: 24px;
            height: 24px;
            &.animation{
                animation: loading 3s linear infinite;
            }
        }
        .pending{
            width: 24px;
            height: 24px;
            border-radius: 100%;
            border: 2px solid var(--text-color-second);
        }
    }
    .btn-go{
        margin-top: 48px;
        width: 100%;
        font-size: 16px;
        height: 48px;
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