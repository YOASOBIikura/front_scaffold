 <template>
    <div class="submitOrder"    >
        <div class="submitOrder-header">
            <div class="top">
                <div class="top-left">
                    <img  class="network" :src="props.dataInfo?.underlyingAsset?.img">
                    <span class="text">{{props.dataInfo?.orderTypeShow=='Call'?props.dataInfo?.underlyingAsset?.name: props.dataInfo?.strikeAsset?.name }} {{  props.dataInfo?.orderTypeShow}} Options Vault</span>
                </div>
                <div class="top-right">
                    <img class="network" :src="props.dataInfo?.chainIcon">
                    <span class="text">{{props.dataInfo?.chainName  }}</span>
                </div>
            </div>

            <div class="price">
                <img v-if="props.dataInfo?.orderTypeShow=='Call'" class="icon" src="@/assets/images/arrow_green.png" alt="">
                <img v-else class="icon" src="@/assets/images/arrow_red.png" alt="">
                <span class="text">${{strikePrice}}</span>
            </div>       

            <div class="bottom">
                 <div class="bottom-left">
                     <span class="text1">Amount</span>
                     <span class="text2">{{props.dataInfo?.underyingAmountShow  }}{{ props.dataInfo?.underlyingAsset?.name }}</span>
                     <span class="text3">${{underlyingValue}}</span>
                 </div>   

                 <div class="bottom-right">
                     <span class="text1">Valid Date</span>
                     <span class="text2">{{props.dataInfo?.days}}</span>
                     <span class="text3">{{props.dataInfo?.date}}</span>
                 </div>
            </div>
        </div>    
        
        <div class="submitOrder-bottom">
         <div class="icon-show">
            <img class="icon" src="@/assets/images/token_bg.png" >
            <img v-if="props.dataInfo?.orderTypeShow=='Call'" class="icon-inner" :src="props.dataInfo?.strikeAsset?.img" alt="">
            <img v-else class="icon-inner" :src="props.dataInfo?.underlyingAsset?.img" alt="">
         </div>
           
            <div class="content">
                <p class="p1">
                    <span class="title">Market Price</span>
                    <span class="text">${{marketPrice}}</span>
                </p>
                <p class="p2" v-show="props.dataInfo.orderStatus">
                    <span class="title">Profit</span>
                    <span class="text">${{profit}}</span>
                </p>
            </div>

            <div class="btn" @click="liquidation" v-if="props.dataInfo?.orderStatus">
                Exercise
            </div>

          
        </div>
        <!-- <div class="notice">
                <img class="icon" src="@/assets/images/info.png" alt="">
                <span class="text">You will incur losses if the price rises to $3410 on 26 feb24</span>
                <img src="@/assets/images/arrow_close.png" alt="">
         </div> -->
    </div>  
 </template>
<script setup>
import { BigNumber, ethers } from 'ethers';
import { reactive,defineEmits,defineProps,computed} from 'vue';
import { useAxiosStore } from "@/pinia/modules/axios";
const axiosStore = useAxiosStore();
const props=defineProps({
     dataInfo:{
       type:Object,
       require:true,
       default:{}
     },
     priceList:{
      type:Object,
       require:true,
       default:{}
     }
})
const emits= defineEmits(["liquidate"])
const data=reactive({         

})
var marketPrice=computed(()=>{
   return getMarketPrice()
})
//抵押价值
var underlyingValue=computed(()=>{
     let asset=""
     let decimals=18
     if(props.dataInfo?.orderTypeShow=="Call"){
         asset=String(props.dataInfo?.underlyingAsset?.address).toLocaleLowerCase()
         decimals=props.dataInfo?.underlyingAsset?.decimals
     }else{
         asset=String(props.dataInfo?.strikeAsset?.address).toLocaleLowerCase()
         decimals=props.dataInfo?.strikeAsset?.decimals
     } 
     let price= props.priceList[asset]
     if(!price){
       return 0
     }
   price= price.mul(props.dataInfo?.underyingAmount).div(ethers.utils.parseUnits("1",decimals)).div(ethers.utils.parseUnits("1",axiosStore.remark.priceDecimals-2)).toNumber()/100
   return price

})

var strikePrice=computed(()=>{
    return getStrikePrice()
})

var profit=computed(()=>{
   //行权价
   let strikePriceTemp=getStrikePrice()
   //市场价
   let narketPriceTemp=getMarketPrice()
   //价差
   let spread=0
   if(props.dataInfo?.orderTypeShow=="Call"){
      spread=narketPriceTemp-strikePriceTemp
   }else{
      spread=strikePriceTemp-narketPriceTemp
   }
   if(spread<=0){
      spread=0
   }
   return spread
})


var getMarketPrice=()=>{
   let asset=""
     if(props.dataInfo?.orderTypeShow=="Call"){
         asset=String(props.dataInfo?.underlyingAsset?.address).toLocaleLowerCase()
     }else{
         asset=String(props.dataInfo?.strikeAsset?.address).toLocaleLowerCase()
     }
     let price= props.priceList[asset]
     if(!price){
       return 0
     }
     price=price.div(ethers.utils.parseUnits("1",axiosStore.remark.priceDecimals-2)).toNumber()/100
     return price
}

var getStrikePrice=()=>{
   let  asset=String(props.dataInfo?.strikeAsset?.address).toLocaleLowerCase()
     let  decimals=props.dataInfo?.strikeAsset?.decimals
     let amount= props.dataInfo?.strikeAmount
     let price= props.priceList[asset]
     if(!price){
       return 0
     }
     return amount.mul(price).div(ethers.utils.parseUnits("1",axiosStore.remark.priceDecimals-2)).div(ethers.utils.parseUnits("1",decimals)).toNumber()/100
}



//---------------------------
var liquidation=()=>{
    emits("liquidate",props.dataInfo)
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
                   font-size: 16px;
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
                   font-size: 16px;
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
               border-radius: 50%;
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