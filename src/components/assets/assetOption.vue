<template>
    <div class="assetOption">
         <div class="top">
            <p class="p1">
               <img class="icon" src="@/assets/images/eth.png" alt="">
               <span class="text">ETH</span>
            </p>
            <p class="p2">
                <span class="title">30234</span>
                <span class="text">$10223202</span>
            </p>
            <p class="p2">
                <span class="title">102</span>
                <span class="text">$1521212</span>
            </p>
         </div>

         <div class="bottom">
             <div class="p1">
                 <p class="select left">
                    <img  src="@/assets/images/arrow_right2.png" alt="">
                 </p>
                 <p class="select">
                    <img  src="@/assets/images/arrow_left.png" alt="">
                 </p>       
             </div>
             <p class="p2">
                 <span class="option ">Sell Call</span>
                 <span class="option right">Sell Put</span>
             </p> 
         </div>
    </div>
</template>
<script setup>

</script>
<style lang="less" scoped>
 .assetOption{
    width: 100%;
    padding: 20px 16px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid var(--border-color);
    .top{
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
        .p1{
            display: flex;
            flex-direction: row;
            align-items: center;
            .icon{
                width: 40px;
                height: 40px;
                border-radius: 50%;
                margin-right: 12px;
            }
            .text{
                color: var(--text-color-primary);
                font-size: 16px;
                font-weight: 600;
            }
        }
        .p2{
           display: flex;
           flex-direction: column;
           align-items: flex-end;
           .title{
              color: var(--text-color-primary);
              font-size: 16px;
              margin-bottom: 3px;
           }
           .text{
              color: var(--text-color-second);
              font-size: 12px;
           }
        }
    }
    .bottom{
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        .p1{
          display: flex;
          flex-direction: row;
          align-items: center;
          .select{
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background-color:var(--bg-color-secondarycontainer) ;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            img{
                width: 16px;
                height: 16px;
            }
          }
          .left{
            margin-right: 8px;
          }
        }
        .p2{
        display: flex;
           flex-direction: row;
           align-items: center;
            .option{
                display: block;
                height: 32px;
                width: 128px;
                background-color:var(--bg-color-secondarycontainer);
                text-align: center;
                line-height: 32px;
                font-size: 14px;
                font-weight: 600;
                color: var(--text-color-primary);
                border-radius: 32px;
            }
            .right{
                margin-left: 8px;
            }

   
        }
    }
 }

</style>