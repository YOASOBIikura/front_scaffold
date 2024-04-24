<template>
  <div class="select">
      <swiper
        :effect="'coverflow'"
        :grabCursor="true"
        :centeredSlides="true"
        :slidesPerView="'auto'"
        :direction="'vertical'"
        :touchRatio="0.8"
        :initialSlide="initialSlide"
        :coverflowEffect="{
          rotate: 5,
          stretch: 5,
          depth: 0,
          modifier: 1,
          slideShadows: true,
          scale: 1.1,
        }"
        :pagination="false"
        :modules="modules"
        :autoHeight="true"
        :class="'mySwiper ' + (options?.length > 4 ? 'has-top' : '')"
        @slideChange="selectChange"
        @init="initSwiper"
        v-if="options.length > 0"
      >
        <swiper-slide
          v-for="(item, index) in options"
          :key="'swiper-select-' + index"
        >
          <div class="option" v-if="activeText">
            <span class="active">
              {{ (item.name || item).split(activeText)[0] }}
            </span>
            <span>
              {{ activeText + (item.name || item).split(activeText)[1] }}
            </span>
          </div>
          <div class="option" v-else>
            <span class="active">
              <span>{{ item.name || item }}</span>
              <span 
              v-if="hasPriceChange && currentPrice" 
              class="price-change"
              :class="currentPrice > item.value?'down':'up'"
                ><img
                  :src="(currentPrice > item.value)?downIcon:upIcon"
                  alt=""
                />{{ formatMoneyPrecision(Math.abs(item.value/currentPrice - 1) * 100, 1) }}%</span
              >
            </span>
          </div>
        </swiper-slide>
      </swiper>
      <div v-else class="no-data">No Data</div>
  </div>
</template>
<script setup lang="ts">
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from "swiper/vue";
import { Swiper as SwiperClass } from "swiper/types";

// import upIcon from '@/assets/images/icon/price-up.png'
// import downIcon from '@/assets/images/icon/price-down.png'

// Import Swiper styles
import "swiper/css";

import "swiper/css/effect-coverflow";

// import required modules
import { EffectCoverflow } from "swiper/modules";
import { Debounce } from "../../common/debounce";

const modules = [EffectCoverflow];

const props = defineProps<{
  options: { value: ""; name: "" }[] | string[]; // 可选项
  changeTimeout: number | undefined; // 防抖延迟时间
  initialSlide?: number | undefined; // 防抖延迟时间
  activeText?: string; // 设置高亮颜色
  hasPriceChange?: boolean;
  currentPrice?: number;
}>();

const emits = defineEmits(["selectChange", "swiper"]);



const selectChange = Debounce(
  (swiper: SwiperClass) => {
    emits("selectChange", swiper.activeIndex);
  },
  props.changeTimeout === undefined ? 0 : props.changeTimeout
);

const initSwiper = (swiper: SwiperClass) => {
  emits("swiper", swiper);
};
</script>
<style lang="less" scoped>
.select {
  display: inline-flex;
  border-radius: 6px;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 120px;
  overflow: hidden;
  padding: 0 4px;
  position: relative;
  &::before{
    content: "";
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
    height: 12px;
    opacity: 0.85;
    background: linear-gradient(18deg, #fff 0%, #fff 70%);
    z-index: 99;
    border-radius: 18px;
    filter: blur(2px);
  }
  &::after{
    content: "";
    position: absolute;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 12px;
    opacity: 0.85;
    background: linear-gradient(18deg, #fff 0%, #fff 70%);
    z-index: 99;
    border-radius: 18px;
    filter: blur(2px);
  }
  .mySwiper {
    // overflow: auto;
    width: 100%;
    overflow: visible;
    // &.has-top {
    :deep(.swiper-wrapper) {
      // top: 14px;
      overflow: visible;
    }
    // }
    .option {
      text-align: center;
      opacity: 0.3;
    }
    :deep(.swiper-slide) {
      font-size: 12px;
      .option {
        height: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
        .price-change {
          margin-left: 4px;
          &.up {
            color: var(--success-color);
          }
          &.down {
            color: var(--error-color);
          }
          img {
            position: relative;
            top: -2px;
            margin-right: 2px;
          }
        }
      }
    }
    :deep(.swiper-slide-prev .option) {
      opacity: 0.8;
    }
    :deep(.swiper-slide-next .option) {
      opacity: 0.8;
    }
    :deep(.swiper-slide .swiper-slide-shadow-top){
      background-image: none;
    }
    :deep(.swiper-slide .swiper-slide-shadow-bottom ){
      background-image: none;
    }
    :deep(.swiper-slide-active) {
      border-radius: var(--radius-default, 6px);
      background-color: #F0F0F0;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: 700;
      font-style: normal;
      font-size: 16px;
      .option {
        opacity: 1;
        height: 40px;
      }
      span.active {
        color: var(--text-color-primary);
        display: flex;
        align-items: center;
        line-height: 0;
      }
    }
  }
}
</style>