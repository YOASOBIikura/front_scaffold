import { defineStore } from 'pinia'
export const useRouteStore = defineStore('route', {
    state: () => ({
        preRoute:null,
        preQuery: null,
        currentRoute:null,
        showLayout:true,
        //更改路由
        changeRoute:"/",
    }),
    getters: {

    },
    actions: {
        setCurrentRoute(preRoute,currentRoute){
            console.log(currentRoute,"---ssss")
             this.currentRoute=currentRoute.path;          
             if(currentRoute.meta&&currentRoute.meta.showLayout){
                 this.showLayout=true
             }else{
                this.showLayout=false
             }
             //对历史路由做缓存处理
             if(preRoute.path!="/"){
                this.preRoute = preRoute.path;
                this.preQuery = preRoute.query;
                localStorage.setItem("preRoute",this.preRoute);
                localStorage.setItem("preQuery",this.preQuery);
             }else{
                 this.preRoute=localStorage.getItem("preRoute");
                 this.preQuery = localStorage.getItem("preQuery");
             }           
        },
        setChangeRoute(changeRoute){
            this.changeRoute=changeRoute
        },
    }
});