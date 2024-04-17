import {createI18n} from 'vue-i18n'
import en from "@/config/i18n/en.json"
import zh from "@/config/i18n/zh.json"
// 准备翻译的语言环境信息
const messages = {
    en: {
      message: en
    },
    zh: {
      message: zh
    }
  }
  

const i18n = createI18n({
    locale: 'zh', // 设置地区  navigator.language 浏览器语言
    messages, // 设置地区信息
    legacy:false,//设置为false 启动 composition API模式
})
  


export {i18n} 