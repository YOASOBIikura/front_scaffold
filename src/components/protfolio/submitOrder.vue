 <template>
    <div class="submitOrder">
        <div class="submitOrder-header">
            <div class="top">
                <div class="top-left">
                    <img  class="network" src="@/assets/images/arbitrum.png">
                    <span class="text">Eth Call Options Vault</span>
                </div>
                <div class="top-right">
                    <img class="network" src="@/assets/images/arbitrum.png">
                    <span class="text">Ethereum</span>
                </div>
            </div>

            <div class="price">
                <img class="icon" src="@/assets/images/arrow_green.png" alt="">
                <span class="text">$3100</span>
            </div>       

            <div class="bottom">
                 <div class="bottom-left">
                     <span class="text1">Amount</span>
                     <span class="text2">1ETH</span>
                     <span class="text3">$3300</span>
                 </div>   

                 <div class="bottom-right">
                     <span class="text1">Valid Date</span>
                     <span class="text2">27 Days</span>
                     <span class="text3">26 Feb 24</span>
                 </div>
            </div>
        </div>    
        
        <div class="submitOrder-bottom">
         <div class="icon-show">
            <img class="icon" src="@/assets/images/token_bg.png" >
            <img class="icon-inner" src="@/assets/images/token-usdt.png" alt="">
         </div>
           
            <div class="content">
                <p class="p1">
                    <span class="title">Strike price</span>
                    <span class="text">$3100</span>
                </p>
                <p class="p2">
                    <span class="title">Profit</span>
                    <span class="text">$898</span>
                </p>
            </div>

            <div class="btn" @click="liquidation">
                Exercise
            </div>

          
        </div>
        <div class="notice">
                <img class="icon" src="@/assets/images/info.png" alt="">
                <span class="text">You will incur losses if the price rises to $3410 on 26 feb24</span>
                <!-- <img src="@/assets/images/arrow_close.png" alt=""> -->
         </div>
    </div>  
 </template>
<script setup>
import { reactive } from 'vue';
const emits= defineEmits(["liquidation"])
const data=reactive({         

})
var liquidation=()=>{
   console.log(3333)
    emits("liquidation")
}
</script>
<style lang="less" scoped>
  .submitOrder{
      width: 100%;
      border: 1px solid var(--border-color);
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      margin-top: 17px;
      .submitOrder-header{
           width: 100%;
           padding: 16px;
           box-sizing: border-box;
           display: flex;
           flex-direction: column;
           .top{
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 9px;
            .top-left{
                display: flex;
                flex-direction: row;
                align-items: center;
                .network{
                   width: 16px;
                   height: 16px;
                   margin-right: 4px;
                   border-radius: 50%;
                }
                .text{
                   font-size: 14px;
                   color:var(--text-color-primary);
                   font-weight: 600;
                }
            }
            .top-right{
               background-color:var(--bg-color-secondarycontainer);
               display: flex;
               flex-direction: row;
               align-items: center;
               justify-content: center;
               padding: 2.5px 4px;
               border-radius: 4px;
               .network{
                   border-radius: 50%;
                   width: 12px;
                   height: 12px;
                   margin-right: 2px;
                }
                .text{
                   font-size: 12px;
                   color:var(--text-color-primary);
                   font-size: 600;
                }
            }
           }
           .price{
              width: 100%;
              display: flex;
              flex-direction: row;
              align-items: center;
              margin-bottom: 16px;
              .icon{
                 width: 16px;
                 height: 16px;
                 border-radius: 50%;
                 margin-right: 4px;
              }
              .text{
                 font-size: 14px;
                 color: var(--text-color-success);
                 font-weight: 600;
              }
           }
           .middle{
              width: 100%;
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              .date{
                  display: flex;
                  flex-direction: column;
                  .title{
                     font-size: 12px;
                     color: var(--text-color-tabs-unActive); 
                     margin-bottom: 11px;
                  }
                  .show{
                     display: flex;
                     flex-direction: row;
                     .progress{
                        width: 12px;
                        margin-right: 6px;
                     }
                     .list{
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        color: var(--text-color-primary);
                        font-size: 14px;
                        .list-one{
                           position: relative;
                           top: -5px;
                        }
                        .list-two{
                            position: relative;
                            bottom: -5px;
                        }
                     }
                  }
              }
              .amount{
                  display: flex;
                  flex-direction: column;
                  align-items: flex-end;
                  .title{
                     font-size: 12px;
                     color: var(--text-color-tabs-unActive); 
                     margin-bottom: 1px;   
                  }
                  .content{
                     display: flex;
                     flex-direction: row;
                     align-items: center;
                     justify-content: flex-end;
                     font-size: 20px;
                     font-weight: 600;
                     margin-bottom: 10px;
                     .pre{
                         color: var(--text-color-third);
                     }
                     .end{
                         color: var(--text-color-primary);
                     }

                  }
                  .progress{
                     width: 100px;
                     height: 18px;
                     border-radius: 4px;
                     background-color:var(--bg-color-secondarycontainer) ;
                     position: relative; 
                     .bar{
                       position:absolute;
                       height: 18px;
                       background-color:var(--text-color-third) ;
                       width: 20%;
                       border-top-left-radius:4px ;
                       border-bottom-left-radius:4px ;
                     }

                  }
              }
           }
           .bottom{
             width: 100%;
             display: flex;
             flex-direction: row;
             justify-content: space-between;
             .bottom-left{
                display: flex;
                flex-direction: column;
                .text1{
                   font-size: 12px;
                   color: var(--text-color-tabs-unActive);
                   margin-bottom: 8px;
                }
                .text2{
                   color: var(--text-color-primary);
                   font-size: 20px;
                   font-weight: 600;
                   margin-bottom: 8px;
                }
                .txet3{
                   color:var(--text-color-tabs-unActive) ;
                   font-size: 12px;
                }
             }
             .bottom-right{
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                .text1{
                   font-size: 12px;
                   color: var(--text-color-tabs-unActive);
                   margin-bottom: 8px;
                }
                .text2{
                   color: var(--text-color-third);
                   font-size: 20px;
                   font-weight: 600;
                   margin-bottom: 8px;
                }
                .txet3{
                   color:var(--text-color-tabs-unActive) ;
                   font-size: 12px;
                }
             }
           }
           
      }
      .submitOrder-bottom{
         border-top: 1px solid var(--border-color);
         width: 100%;
         padding: 16px;
         box-sizing: border-box;
         position: relative;
         .icon-show{
            position: absolute;
            width: 114px;
            height: 114px;
            left:50%;
            transform: translateX(-50%);
            top: -58px;
            z-index: 100;
            .icon-inner{
               width: 24px;
               height: 24px;
               position: absolute;
               left: 50%;
               top: 50%;
               transform: translateX(-50%) translateY(-50%);
            }
         }
         .content{
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            margin-bottom: 16px;
            .p1{
                display: flex;
                flex-direction: column;
                .title{
                  font-size: 12px;
                  color: var(--text-color-second);
                  margin-bottom: 4px;
                }
                .text{
                  font-size: 14px;
                  font-weight: 600;
                  color: var(--text-color-primary);
                }
            }
            .p2{
                display: flex;
                flex-direction: column;
                .title{
                  font-size: 12px;
                  color: var(--text-color-second);
                  margin-bottom: 4px;
                }
                .text{
                  font-size: 14px;
                  font-weight: 600;
                  color: var(--text-color-third);
                }
            }

         }
         .btn{
            width: 100%;
            height: 48px;
            border-radius: 8px;
            background: var(--bg-color-container-active);
            text-align: center;
            line-height: 48px;
            color: var(--text-color-active);
            font-size: 16px;
            font-weight: 600;
         }
        
      }
      .notice{
         border-bottom-left-radius: 16px;
         border-bottom-right-radius: 16px;
         border-top:1px solid var(--border-color) ;
         background: var(--bg-color-secondarycontainer);
         display: flex;
         flex-direction: row;
         align-items: center;
         padding: 20px 16px;
         box-sizing: border-box;
         .icon{
            width: 24px;
            height: 24px;
            margin-right: 12px;
         }
         .text{
            color: var(--text-color-primary);
            font-size: 12px;
         }
      }
}
</style>