import { createStore, createLogger } from "vuex";

const store = createStore({
    state: {
        hasPermission: "",//全局权限状态
        account: "", //登录状态
        name:""
    },
    mutations: {
        //改变权限
        changeAuthority(state, playload){
            state.hasPermission = playload.authoriy;
        },
        //改变登录状态
        changeAccount(state, playload){
            state.account = playload.account;
        },
        changeName(state, playload){
            state.name = playload.name;
        }
    }
})

export default store;