<template>
    <div class="inputValue">
        <div class="input-content">
           <input type="text" v-model="data.inputShow"   @input="inputValue"  class="input">
           <span class="suffix">{{ props.symbol}}</span>
        </div>

        <div class="input-bottom">
            <div class="left">
               <slot class="info"></slot>
            </div>
            <span class="Max" @click="max">Max</span> 
        </div>
    </div>
</template>
<script setup>
import { BigNumber, ethers } from 'ethers';
import { reactive,defineProps,defineEmits,computed,onMounted} from 'vue';

const props=defineProps({
    value:{
        type:[String,Number,Object],
        default:"",
        require:true
    },
    decimals: { type: Number, default: 18,require:true },
    symbol:{
        type:String,
        default:""
    },
    maxValue:{
        type:[String,Number,Object],
        default:"",
        require:true  
    },
    isApproximate:{
        type:Boolean,
        default:true
    }
})
const data=reactive({
     inputShow:""
})

onMounted(()=>{
    handleValue(props.value)
})
const emits=defineEmits(["update:value","inputMax","change"])
var max=()=>{
    handleValue(props.maxValue)
    emits("update:value",props.maxValue)
    emits("inputMax",props.value,data.inputShow)
}
var inputValue= (input)=>{
    let value=input.target.value
    if( BigNumber.from("0").eq(BigNumber.from(props.maxValue))){
        value=BigNumber.from("0")
    }else{
            if(value!=""){
                value=ethers.utils.parseUnits(String(value),props.decimals)
                if(value.mul(ethers.utils.parseUnits("1",2)).div(props.maxValue).gte(BigNumber.from("99"))){
                    value=props.maxValue       
                } 
            }else{
                value=BigNumber.from("0")
            }
    }
    handleValue(value)
    emits("change",value)
    emits("update:value",value)
}

var handleValue=(value)=>{
    data.inputShow=String(BigNumber.from(value).div(ethers.utils.parseUnits("1",props.decimals-2)).toNumber()/100)
}


</script>

<style lang="less" scoped>
.inputValue{ 
    width: 100%;
    // height: 106px;
    background-color: var(--bg-color-secondarycontainer);
    border-radius: 8px;
    position: relative;
    padding: 16px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .input-content{
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        .input{
            background: none;
            outline: none;
            border: none;
            font-size: 36px;
            font-weight: 600;
            color: var(--text-color-primary);
            width: 100%;
        }
        .suffix{
            font-size: 36px;
            font-weight: 600;
            color: var(--text-color-tabs-unActive);
            margin-left: 10px;
         }
    }
    .input-bottom{
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-top: 8px;
        .left{
            width: 100%;
        }
        .Max{
            padding: 4px 12px;
            background: var(--bg-color-page);
            font-weight: 600;
            font-size: 14px;
            color: var(--text-color-primary);
            border-radius: 32px;
        }
    }

}

</style>