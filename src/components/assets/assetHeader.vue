<template>
    <div class="assetsHeader">
         <div class="left">
                <img class="icon" src="@/assets/images/avatarDemo.png" alt="">
            
                <div class="info">
                    <p class="top">
                        <span class="text">Joey268</span>
                        <img class="img" src="@/assets/images/certified.png" alt="">
                    </p>
                    <p class="bottom">
                        <span class="text">0x69...350d</span>
                        <img class="img" src="@/assets/images/copy2.png" alt="">
                    </p>
                </div>
          </div>
          <img class="option" src="@/assets/images/arrow_right.png" alt="">     
         </div>
</template>
<script setup>

</script>
<style lang="less" scoped>
    .assetsHeader{
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding:32px 16px;
        box-sizing: border-box;
        justify-content: space-between;
        border-bottom:8px solid var(--border-color) ;
        .left{
            display: flex;
            flex-direction: row;
            align-items: center;
            .icon{
                width: 64px;
                height: 64px;
                border-radius: 50%;
                margin-right: 16px;
            }
            .info{
                display: flex;
                flex-direction: column;
                justify-content: center;

                .top{
                   display: flex;
                   flex-direction: row;
                   align-content: center; 
                   margin-bottom: 6px;
                   .img{
                      width: 16px;
                      height: 16px;
                   }
                }
                .bottom{
                   display: flex;
                   flex-direction: row;
                   align-content: center;
                   .img{
                     width: 16px;
                     height: 16px;
                   }
                }
            }
        }
        .option{
            width: 16px;
            height: 16px;
        }

    }
</style>