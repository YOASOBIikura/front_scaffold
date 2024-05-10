<template>
      <a-drawer v-if="props.isOpen"  :height="'auto'" class="liquidation"  :closable="false" :headerStyle="{padding:'0px'}" :bodyStyle="{padding:'0px'}" :placement="'bottom'"   :open="props.isOpen">
        <template v-slot:title>
             <div class="filter">
                 <span class="title">Tips</span>
                 <span></span>
             </div>
        </template>
        <div class="tips-body">
            <div class="tips">
                <img src="@/assets/images/loading-faild.png" class="tips-img"/>
                <div class="tips-title">Premium balance not enough.</div>
                <a-button 
                    type="primary" 
                    class="btn-go"
                    @click="closeDrawer"
                >Close</a-button>
                <a-button class="btn-view"  @click="goToTransfer">Go to Transfer</a-button>
        </div>
       </div>
      </a-drawer>
</template>
<script setup>
import { reactive,defineProps,defineEmits,computed} from 'vue';
import { BigNumber, ethers } from 'ethers';
import { useAxiosStore } from "@/pinia/modules/axios";
import { message } from 'ant-design-vue';
import { useRouter} from "vue-router";
const axiosStore = useAxiosStore();
const router = useRouter();
const data=reactive({
    currentIndex:0
})
const props=defineProps({
   isOpen:{
       type:Boolean,
       require:true,
       default:false
   },
   dataInfo: {
    type: Object,
    require: true,
    default: {
        asset: {},
        amount: BigNumber.from("0"), // 需要充值的数量
        callBackId: "", 
        callBackName: "",
        callBackRawAmount: BigNumber.from("0") // 原本需要购买的数量回调
    }
   }
})
const emits= defineEmits(["update:isOpen","liquidate"])
//关闭弹窗
var closeDrawer=()=>{
   emits("update:isOpen",false)
}

var goToTransfer = () => {
    closeDrawer();
    console.log(props.dataInfo.amount.toHexString());
    router.push({
        path: "/assetTransfer",
        query: {
            asset: props.dataInfo?.asset?.address,
            type: "issue",
            amount: props.dataInfo.amount.toHexString(),
            callBackId: props.dataInfo?.callBackId,
            callBackName: props.dataInfo?.callBackName,
            callBackRawAmount: props.dataInfo?.callBackRawAmount.toHexString()
        }
    });

}



</script>
<style lang="less" scoped>
      .liquidation{
        width: 100%;
        .filter{
            width: 100%;
            padding: 16px;
            box-sizing: border-box;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            .text{
            font-size: 16px;
            font-weight: 600;
            color: var( --text-color-primary);
            }
            .close{
            width: 24px;
            height: 24px;
            }
        }

    .tips-body{
        padding: 50px 12px 40px 12px;
        overflow: hidden;
        .tips{
            display: flex;
            flex-direction: column;
            align-items: center;
            .tips-img{
                width: 128px;
            }

            .tips-title{
                font-size: 16px;
                margin-top: 40px;
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
    }


</style>