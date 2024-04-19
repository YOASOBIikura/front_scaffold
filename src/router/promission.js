// 存放路由守卫
import {useLayoutStore} from "@/pinia/modules/layout";
import { store } from '@/pinia'
import router  from "./index"

const layoutStore = useLayoutStore(store)
router.beforeEach((to) => {
  if(to.meta && to.meta.showLayout !== undefined){
    layoutStore.changeShowType(to.meta.showLayout);
  }
});