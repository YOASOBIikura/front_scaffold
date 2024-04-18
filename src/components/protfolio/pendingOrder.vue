<template>
    <div class="pendingOrder">
        <div class="top">
            <div class="top-left">
                 <img src="" alt="" srcset="">
                 <span>Eth Call Options Vault</span>
            </div>
            <div class="top-right">
                <img src="" alt="" srcset="">
                <span>Ethereum</span>
            </div>
        </div>

        <div class="price">
            <img src="" alt="">
            <span>$3100</span>
        </div>


        <div class="middle">
             <div class="date">
                  <span>Valid Date</span>
                  <div>
                      <img src="" alt="">
                      <p>
                         <span>11 Feb 24</span>
                         <span>29 Feb 24</span>
                      </p>
                  </div>
             </div>

             <div class="amount">
                   <span>Amount</span>
                   <p>
                       <span>30</span>
                       <span>/50ETH</span>
                   </p>
                   <a-progress :percent="30" />
             </div>
        </div>

        <div class="bottom">
           <div class="bottom-left">
                <p>
                    <span>Price:</span>
                    <span>$903.USDT/USDC</span>
                </p>
                <P>
                    <span>Accept:</span>
                    <span>Cash Settlement/Asset Delivery</span>
                </P>
            </div> 

            <div class="bottom-right">
                <img src="" alt="" srcset="">
            </div>
        </div>
    </div>
</template>
<script setup>

</script>

<style lang="less" scoped>
  .pendingOrder{
    color: red;
  }
</style>