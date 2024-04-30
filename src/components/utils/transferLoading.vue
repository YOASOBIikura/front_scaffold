<template>
    <a-drawer
        v-if="props.isOpen" height="420px" 
        class="assetTranfer"  
        :closable="false" 
        :headerStyle="{padding:'0px'}" 
        :bodyStyle="{padding:'0px'}" 
        :placement="'bottom'"   
        :open="props.isOpen"  
        @close="closeDrawer"
    >
        
    </a-drawer>
</template>
<script setup>
const props=defineProps({
   isOpen:{
       type:Boolean,
       require:true,
       default:false
   }
})
const emits=defineEmits(["update:isOpen"])

var closeDrawer=()=>{
   emits("update:isOpen",false)
}

</script>
<style lang="less" scoped>

</style>