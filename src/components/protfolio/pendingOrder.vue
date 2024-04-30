<template>
  <div class="pendingOrder">
    <div class="pendingOrder-header">
      <div class="top">
        <div class="top-left">
          <img class="network" :src="props.orderData?.underlyingAsset?.img" />
          <span class="text"
            >{{ props.orderData?.underlyingAsset.name }}
            {{ optionTypeShow }} Options Vault</span
          >
        </div>
        <div class="top-right">
          <img class="network" :src="networkImgSrc" />
          <span class="text">{{ props.orderData.netWork }}</span>
        </div>
      </div>

      <div class="price">
        <img class="icon" src="@/assets/images/arrow_green.png" alt="" v-if="props.orderData.orderType === 'call'"/>
        <img class="icon" src="@/assets/images/arrow_red.png" alt="" v-if="props.orderData.orderType === 'put'"/>
        <span class="text" :class="{'color-red': props.orderData.orderType === 'put'}">${{ props.orderData.strikePrice }}</span>
      </div>

      <div class="middle">
        <div class="date">
          <span class="title">Valid Date</span>
          <div class="show">
            <img class="progress" src="@/assets/images/dateBar.png" alt="" />
            <p class="list">
              <span class="list-one">{{ createDateShow }}</span>
              <span class="list-two">{{ expirationDateShow }}</span>
            </p>
          </div>
        </div>

        <div class="amount">
          <span class="title">Amount</span>
          <p class="content">
            <span class="pre">{{ remainderShow }}</span>
            <span class="end"
              >/{{ props.orderData.total
              }}{{ props.orderData?.underlyingAsset.name }}</span
            >
          </p>
          <div class="progress">
            <p
              class="bar"
              :style="{
                width: (remainderShow / props.orderData.total) * 100 + '%',
              }"
              :class="{ 'is-all': remainderShow == props.orderData.total }"
            ></p>
          </div>
        </div>
      </div>
    </div>

    <div class="pendingOrder-bottom">
      <div class="bottom-left">
        <p class="list-one">
          <span class="title">Price:</span>
          <span class="text"
            >${{ props.orderData.premiumPrice }}·{{ premiumNameShow }}</span
          >
        </p>
        <p class="list-two">
          <span class="title">Accept:</span>
          <span class="text">{{ props.orderData.liquidate }}</span>
        </p>
      </div>

      <div class="bottom-right" @click="editOption">
        <img class="edit" src="@/assets/images/edit.png" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, reactive } from "vue";
import { useRouter } from "vue-router";
import { TimeTransformDateWithoutHour } from "@/common/timeFormat";
import { useAxiosStore } from "@/pinia/modules/axios";
const props = defineProps({
  orderData: {
    type: Object,
    require: true,
    default: {},
  },
});
const axiosStore = useAxiosStore();

const router = useRouter();
const data = reactive({});
const optionTypeShow = computed(() => {
  let type = props.orderData.orderType;
  return type.slice(0, 1).toUpperCase() + type.slice(1);
});
const premiumNameShow = computed(() => {
  let str = "";
  props.orderData.premiumAssets.forEach((item, index) => {
    str += item.name;
    if (index + 1 < props.orderData.premiumAssets.length) {
      str += "/";
    }
  });
  return str;
});
const createDateShow = computed(() => {
  return TimeTransformDateWithoutHour(props.orderData.createDate);
});
const expirationDateShow = computed(() => {
  return TimeTransformDateWithoutHour(props.orderData.expirationDate);
});

// 剩余没用的显示
const remainderShow = computed(() => {
  return Number(props.orderData.total) - Number(props.orderData.used);
});
const networkImgSrc = computed(() => {
  return JSON.parse(JSON.stringify(axiosStore.remark?.chainIcon));
});
var editOption = () => {
  let routerName = `/sell${optionTypeShow.value}`;
  router.push({ 
    path: routerName,
    query: {
        asset:props.orderData.underlyingAsset.name,
        id: props.orderData.id
    }
   });
};
</script>

<style lang="less" scoped>
.pendingOrder {
  width: 100%;
  border: 1px solid var(--border-color);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  margin-top: 17px;
  margin-bottom: 17px;
  .pendingOrder-header {
    width: 100%;
    padding: 16px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    .top {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 9px;
      .top-left {
        display: flex;
        flex-direction: row;
        align-items: center;
        .network {
          width: 16px;
          height: 16px;
          margin-right: 4px;
          border-radius: 50%;
        }
        .text {
          font-size: 14px;
          color: var(--text-color-primary);
          font-weight: 600;
        }
      }
      .top-right {
        background-color: var(--bg-color-secondarycontainer);
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        padding: 2.5px 4px;
        border-radius: 4px;
        .network {
          border-radius: 50%;
          width: 12px;
          height: 12px;
          margin-right: 2px;
        }
        .text {
          font-size: 12px;
          color: var(--text-color-primary);
          font-size: 600;
        }
      }
    }
    .price {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-bottom: 16px;
      .icon {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        margin-right: 4px;
      }
      .text {
        font-size: 14px;
        color: var(--text-color-success);
        font-weight: 600;
        &.color-red{
            color: var(--text-color-error);
        }
      }
    }
    .middle {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .date {
        display: flex;
        flex-direction: column;
        .title {
          font-size: 12px;
          color: var(--text-color-tabs-unActive);
          margin-bottom: 11px;
        }
        .show {
          display: flex;
          flex-direction: row;
          .progress {
            width: 12px;
            margin-right: 6px;
          }
          .list {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            color: var(--text-color-primary);
            font-size: 14px;
            .list-one {
              position: relative;
              top: -5px;
            }
            .list-two {
              position: relative;
              bottom: -5px;
            }
          }
        }
      }
      .amount {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        .title {
          font-size: 12px;
          color: var(--text-color-tabs-unActive);
          margin-bottom: 1px;
        }
        .content {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-end;
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 10px;
          .pre {
            color: var(--text-color-third);
          }
          .end {
            color: var(--text-color-primary);
          }
        }
        .progress {
          width: 100px;
          height: 18px;
          border-radius: 4px;
          background-color: var(--bg-color-secondarycontainer);
          position: relative;
          .bar {
            position: absolute;
            height: 18px;
            background-color: var(--text-color-third);
            width: 0%;
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
            &.is-all {
              border-radius: 4px;
            }
          }
        }
      }
    }
  }
  .pendingOrder-bottom {
    width: 100%;
    border-top: 1px solid var(--component-border);
    padding: 16px;
    box-sizing: border-box;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .bottom-left {
      display: flex;
      flex-direction: column;
      .list-one {
        display: flex;
        flex-direction: row;
        align-items: center;
        font-size: 12px;
        margin-bottom: 8px;
        .title {
          color: var(--text-color-tabs-unActive);
        }
        .text {
          color: var(--text-color-primary);
        }
      }
      .list-two {
        display: flex;
        flex-direction: row;
        align-items: center;
        font-size: 12px;
        .title {
          color: var(--text-color-tabs-unActive);
        }
        .text {
          color: var(--text-color-primary);
        }
      }
    }
    .bottom-right {
      width: 32px;
      height: 32px;
      background-color: var(--bg-color-container-active);
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .edit {
        width: 16px;
        height: 16px;
      }
    }
  }
}
</style>