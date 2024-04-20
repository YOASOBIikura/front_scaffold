<template>
    <div class="option-details">
        <div class="collapse-title" @click="data.detailCollapse = !data.detailCollapse">
                <span>
                    Details 
                    <img src="@/assets/images/arrow_open.png" v-if="data.detailCollapse"/>
                    <img src="@/assets/images/arrow_close.png" v-else/>
                </span>
        </div>
        <div v-if="data.detailCollapse">
            <div>
                <details-info></details-info>
            </div>
            <div>
                <description></description>
            </div>
            <div>
                <settlement></settlement>
            </div>  
            <div>
                <repay-type></repay-type>
            </div>
            
        </div>
    </div>
</template>
<script setup>
import { reactive } from "vue";
import description from "./description.vue";
import settlement from "./settlement.vue";
import repayType from "./repayType.vue";
import detailsInfo from "./detailsInfo.vue";

let data = reactive({
    detailCollapse: false
});

</script>
<style scoped lang="less">
.option-details{
    margin-top: 28px; 
    .collapse-title{
        font-size: 14px;
        font-weight: 600;
        text-align: center;
        width: 100%;
        position: relative;
    
        img{
            vertical-align: sub;
            width: 16px;
        }
        &::before{
            content: "";
            width: calc(40% - 20px);
            border: 1px solid var(--component-border);
            height: 1px;
            position: absolute;
            top: 8px;
            left: 0px;
        }
        &::after{
            content: "";
            width: calc(40% - 20px);
            border: 1px solid var(--component-border);
            height: 1px;
            position: absolute;
            top: 8px;
            right: 0;
        }
    }
}


  
   
   
</style>