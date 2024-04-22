<template>
    <div class="inputValue">
        <div class="input-content">
           <input type="text" :value="props.value"   @input="inputValue"  class="input">
           <span class="suffix">USDT</span>
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
import { reactive,defineProps,defineEmits,nextTick} from 'vue';

const props=defineProps({
    value:{
        type:[String,Number],
        default:"",
        require:true
    },
    decimals: { type: Number, default: 18,require:true }
})

const emits=defineEmits(["update:value","inputMax"])

const data=reactive({  

})

var max=()=>{
    emits("inputMax")
}

var inputValue=(input)=>{
    // this.value = this.value.replace(/\D/g, '');



//   let bis = "";
//   let reservedBits = (props.decimals !== undefined && props.decimals !== null) ? props.decimals : 18;


//   for (let i = 0; i < reservedBits; i++) {
//     bis += "\\d";
//   }

//   let num =props.value;


//   let position = '';
//   if (num.startsWith('-') && props.hasMinus) {
//     position = "-";
//     num = num.substring(1, num.length);
//   }
//   let regx = /[^\d\.]/g;
//   if (props.decimals === 0) {
//     regx = /[^\d]/g;
//   }
//   // 正数限制
//   let tempVal = num.replace(regx, "");
//   let Regex = new RegExp(`^(-)*(\\d+)\\.(${bis}).*$`);
//   num = tempVal.replace(Regex, "$1$2.$3").replace(".", "$#$")  .replace(/\./g, "").replace("$#$", ".");
//   if (position === '-') {
//     num = position + num;
//   }


 


 emits("update:value",value)
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