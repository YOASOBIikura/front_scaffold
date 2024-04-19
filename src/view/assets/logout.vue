<template>
    <div class="logout">
        <navigationBar> </navigationBar>   
        <div class="content">
            <div class="avtor">
                <img src="@/assets/images/avatarDemo.png" alt="">
                 <p>
                    <img src="@/assets/images/time.png" alt="">
                 </p> 
           
            </div>

            <div>
                <p>
                    <span>Username</span>
                    <span>Joey256</span>
                </p>
                <span>edit</span>
            </div>

            <div>
                <p>
                    <span>KYT</span>
                    <span>Under Review</span>
                </p>
                <img src="@/assets/images/review.png" alt="">
            </div>

           <div>
                <p>
                    <span>Address</span>
                    <span>0x12230</span>
                </p>
                <span>copy</span>
            </div>
            

            <p class="btn">
                <img src="@/assets/images/tick2.png" alt="">
                <span>Disconnect</span>
            </p>
        </div>   
    </div>
</template>
<script setup>
 import navigationBar from "@/components/utils/navigationBar.vue"
</script>
<style lang="less" scoped>
.logout{
    width: 100%;
    padding: 0 16px;
    box-sizing: border-box;
}
</style>