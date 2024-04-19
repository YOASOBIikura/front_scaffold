import { createApp } from 'vue'
import App from './App.vue'
import { store } from '@/pinia'
import router from "@/router/index"
import {i18n} from "@/plugin/i18n/i18n"
import '@/assets/css/global.css'
import "@/router/promission"

import Antd from 'ant-design-vue';

createApp(App)
    .use(Antd)
    .use(store)
    .use(router)
    .use(i18n)
    .mount('#app')
