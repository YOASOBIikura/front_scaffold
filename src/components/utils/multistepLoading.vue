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
                 <img v-if="canClose"  class="close" src="@/assets/images/close.png" alt="" @click="closeDrawer">
             </div>
        </template>
        <div class="loading-content">
            <div class="loading-row" v-for="item in props.stepList" :key="'loading-' + item.name">
                {{ item.name }}
                <img src="@/assets/images/loading.png" v-if="item.status === 'current'" class="loading-img animation"/>
                <div class="pending" v-else-if="item.status === 'pending'"></div>
                <img src="@/assets/images/loading-success.png" v-else-if="item.status === 'success'" class="loading-img"/>
            </div>
            <a-button 
                type="primary" 
                class="btn-go"
                @click="goToNextPage"
                disabled
            >Go to {{props.nextPage.name}}</a-button>
        </div>
    </a-drawer>
</template>
<script setup>
import { reactive,computed } from "vue";

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


const data = reactive({

});
const canClose = computed(() => {
    return false;
});
const calcHeight = computed(() => {
    return 240 + (props.stepList.length * 55);
})
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
}
.loading-content{
    padding: 20px 12px 0;
    overflow: hidden;
    .loading-row{
        border: 1px solid var(--component-border);
        border-radius: 8px;
        padding: 4px 16px;
        margin-top: 16px;
        font-size: 16px;
        line-height: 36px;
        display: flex;
        justify-content: space-between;
        align-items: center;
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