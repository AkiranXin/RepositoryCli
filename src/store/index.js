import { createStore, createLogger } from "vuex";

const store = createStore({
    state: {
        count: 1,
        hasPermission: "",//全局权限状态
    },
    mutations: {
        increament(state) {
            state.count++;
        },
        //改变权限
        changeAuthority(state, playload){
            state.hasPermission = playload.authoriy;
        }
    }
})

export default store;