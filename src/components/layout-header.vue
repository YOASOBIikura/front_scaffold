<template>
    <div class="header">
        <div>图片代替位置</div>
        <div v-if="!isWalletConnect">
            <a-button 
                shape="round" 
                type="primary"
                @click="connectWallet"
                >Connect Wallet</a-button>
        </div>
        <div v-else>
            <div class="account-btn">
                <img class="account-img" src="@/assets/images/accountDemo.png"/>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M13 6L8 11L3 6" stroke="#8E8E8E" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round"/>
                </svg>
            </div>
        </div>
    </div>
</template>
<script setup>
import { useModalStore } from '@/pinia/modules/modal';
import { useAxiosStore } from "@/pinia/modules/axios";
import { onMounted,ref,watch } from "vue";
//钱包链接
let modalStore= useModalStore();
const axiosStore = useAxiosStore();
let isWalletConnect = ref(false);
/**
 * 连接钱包
 */
const connectWallet = () => {
    modalStore.modal.open();
}

onMounted(() => {
    // 判断是否连接wallet
    isWalletConnect.value = axiosStore.isConnect;

});

watch(() => axiosStore.isConnect,
    (val) => {
        isWalletConnect.value = val;
    }
)

</script>
<style lang="less" scoped>
.header{
    height: 56px;
    width: 100%;
    display: flex;
    padding: 12px;
    justify-content: space-between;
    align-items: center;
    .account-btn{
        width: 60px;
        height: 32px;
        background-color: var(--bg-color-secondarycontainer);
        display: flex;
        justify-content: space-around;
        align-items: center;
        border-radius: 36px;
        .account-img{
            width: 24px;
            height: 24px;
        }
    }

}
</style>