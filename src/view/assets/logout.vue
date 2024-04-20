<template>
    <div class="logout">
        <navigationBar> </navigationBar>   
        <div class="content">
            <div class="avtor">
                <div class="avtor-content">
                    <img class="icon" src="@/assets/images/avatarDemo.png" alt="">
                    <p class="edit">
                        <img class="edit-icon" src="@/assets/images/time.png" alt="">
                   </p>    
                </div>  
            </div>

            <div class="item">
                <p class="info">
                    <span class="text1">Username</span>
                    <span class="text2">Joey256</span>
                </p>
                <span class="edit">edit</span>
            </div>

            <div class="item">
                <p class="info">
                    <span class="text1">KYT</span>
                    <span class="text2">Under Review</span>
                </p>
                <img class="safe" src="@/assets/images/review.png" alt="">
            </div>

           <div class="item">
                <p class="info">
                    <span class="text1">Address</span>
                    <span class="text2">0x12230</span>
                </p>
                <span class="copy">copy</span>
            </div>
            

            <p class="btn">
                <img class="icon" src="@/assets/images/tick2.png" alt="">
                <span class="text">Disconnect</span>
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
    padding: 56px 0px 0px;
    box-sizing: border-box;
    height: 100%;
    background: var(--bg-color-secondarycontainer);
    .content{
        width: 100%;
        height: 100%;
        .avtor{
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 8px 0 40px;
            background: var( --bg-color-page);

            .avtor-content{
                width: 96px;
                height: 96px;
                position: relative;
                .icon{
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                }
                .edit{
                    position: absolute;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    border:2px solid var(--border-color-second);
                    background: var(--bg-color-secondarycontainer);
                    right: 0px;
                    bottom: 0px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    .edit-icon{
                        width: 14px;
                        height: 14px;
                    }
                }
            }

        }
        .item{
            background: var( --bg-color-page);
            width: 100%;
            padding:0 16px;
            box-sizing: border-box;
            height: 80px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            border-top:1px solid var(--border-color);
            .info{
                display: flex;
                flex-direction: column;
                .text1{
                   color: var(--text-color-primary);
                   font-size: 16px;
                   font-weight: 600;
                   margin-bottom: 6px;
                }
                .text2{
                   color: var( --text-color-second);
                   font-size: 14px;
                   font-weight: 400;
                }
            }
            .edit{
                display:inline-block;
                padding: 7px 12px;
                border-radius: 32px;
                background-color: var(--bg-color-secondarycontainer);
                color: var(--text-color-primary);
                font-size: 16px;
                font-weight: 600;
            }
            .safe{
                width: 24px;
                height: 24px;
            }
            .copy{
                display:inline-block;
                padding: 7px 12px;
                border-radius: 32px;
                background-color: var(--bg-color-secondarycontainer);
                color: var(--text-color-primary);
                font-size: 16px;
                font-weight: 600;                
            }
        }
        .btn{
            background: var( --bg-color-page);
            border-top: 8px solid var( --border-color);
            width: 100%;
            height: 56px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            .icon{
                width: 16px;
                height: 16px;
                margin-right: 4px;
            }
            .text{
                color: var(--text-color-primary);
                font-size: 16px;
                font-weight: 600;
            }
        }
    }
}
</style>