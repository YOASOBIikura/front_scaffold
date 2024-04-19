import { defineStore } from 'pinia'


export const useLayoutStore = defineStore('layout', {
    state: () => ({
        show: false
    }),
    getters: {},
    actions: {
        changeShowType(type){
            this.show = type;
        }
    }
});