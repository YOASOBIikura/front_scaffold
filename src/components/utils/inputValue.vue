<template>
    <div class="inputValue">
        <div class="input-content">
           <input type="text" v-model="data.inputShow"   @input="inputValue"  @blur="blurChange" class="input">
           <span class="suffix">{{ props.symbol}}</span>
        </div>

        <div class="input-bottom" v-if="props.isSuffix">
            <div class="left">
               <slot class="info"></slot>
            </div>
            <span class="Max" @click="max">Max</span> 
        </div>
    </div>
</template>
<script setup>
import { BigNumber, ethers } from 'ethers';
import { reactive,defineProps,defineEmits,computed,onMounted, watch, nextTick} from 'vue';

const props=defineProps({
    value:{
        type:[String,Number,Object],
        default:"",
        require:true
    },
    valueChange: {
        type:[String,Number,Object],
        default:"",
        require:false
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
    },
    isSuffix:{
        type:Boolean,
        default:true
    },
    isMax:{
        type:Boolean,
        default:true
    }
})
const data=reactive({
     inputShow:"",
     preValue:""
})

onMounted(()=>{
    if(BigNumber.from(props.value)){
        data.inputShow=props.value.div(ethers.utils.parseUnits("1",props.decimals-3)).toNumber()/1000
    }
})
watch(
    () => props.valueChange,
    (val) => {
        data.inputShow = val.div(ethers.utils.parseUnits("1",props.decimals-3)).toNumber()/1000;
        emits("update:value",val);
    }
)
const emits=defineEmits(["update:value","inputMax","input","blur"])
var max=()=>{
    let value=props.maxValue
    data.inputShow=String(BigNumber.from(value).div(ethers.utils.parseUnits("1",props.decimals-3)).toNumber()/1000)
    emits("update:value",props.maxValue)
    emits("inputMax",props.maxValue,data.inputShow)
}
var inputValue= (input)=>{
    let value=input.target.value;
    //处理字符串等
    const regex = /^\d*\.?\d*$/;
    let isDigit= regex.test(value)
    if(!isDigit){
        //获取最后一位元素  不数字的情况下 删除最后一位元素
        value=String(value).substring(0,String(value).length-1)
    }
    //处理小数点的情况
    let lastValue=String(value).substring(String(value).length-1)
    if(lastValue=="."){
        data.inputShow=value
        return
    } 
    // 处理只有0和小数点的情况
    const OnlyZeroAndDigitRegx = /^[0.\\.]*$/;
    let isOnlyZeroAndDigit = OnlyZeroAndDigitRegx.test(value);
    if(isOnlyZeroAndDigit){
        data.inputShow=value;
        return
    }
    data.inputShow=Number(value)
    //处理为bigNumber
    if(props.isMax && BigNumber.from("0").eq(BigNumber.from(props.maxValue))){
        value=BigNumber.from("0")
    }else {
        if(value!=""){
            value=ethers.utils.parseUnits(String(value),props.decimals)
            if(props.isMax && value.mul(ethers.utils.parseUnits("1",3)).div(props.maxValue).gte(BigNumber.from("999"))  && String(data.preValue).length<=String(data.inputShow).length){
                value=props.maxValue    
                //触发最大值的情况下修改显示值
                nextTick(() => {
                    data.inputShow=props.maxValue.div(ethers.utils.parseUnits("1",props.decimals-3)).toNumber()/1000
                })
            } 
        }else{
            value=BigNumber.from("0")
        }
    } 
    emits("input",value)
    emits("update:value",value)
    data.preValue=data.inputShow
}

var blurChange=()=>{  
   let value =data.inputShow
   if(value === ""){
    return;
   }
   let lastValue=String(value).substring(String(value).length-1)
   if(lastValue=="."){
       data.inputShow=String(value).substring(0,String(value).length-1)
   } 
   let newValue=ethers.utils.parseUnits(String(value),props.decimals)
    if(props.isMax && newValue.mul(ethers.utils.parseUnits("1",3)).div(props.maxValue).gte(BigNumber.from("990"))  && String(data.preValue).length<=String(data.inputShow).length){
        newValue=props.maxValue    
        //触发最大值的情况下修改显示值
        nextTick(() => {
            data.inputShow=props.maxValue.div(ethers.utils.parseUnits("1",props.decimals-3)).toNumber()/1000
        })
    } 
   
   emits("input",newValue)
   emits("update:value",newValue)
   emits("blur",newValue)
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