import { defineStore } from 'pinia'
export const useRouteStore = defineStore('route', {
    state: () => ({
        preRoute:null,
        currentRoute:null,
        showLayout:true,
        //更改路由
        changeRoute:"/"
    }),
    getters: {

    },
    actions: {
        setCurrentRoute(preRoute,currentRoute){
             this.currentRoute=currentRoute.path;          
             if(currentRoute.meta&&currentRoute.meta.showLayout){
                 this.showLayout=true
             }else{
                this.showLayout=false
             }
             //对历史路由做缓存处理
             if(preRoute.path!="/"){
                this.preRoute=preRoute.path
                localStorage.setItem("preRoute",this.preRoute)
             }else{
                 this.preRoute=localStorage.getItem("preRoute")
             }           
        },
        setChangeRoute(changeRoute){
            this.changeRoute=changeRoute
        }
    }
});