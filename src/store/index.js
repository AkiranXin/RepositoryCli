import { createStore, createLogger } from "vuex";

const store = createStore({
    state: {
        hasPermission: "",//全局权限状态
        isLogin: "" //登录状态
    },
    mutations: {
        //改变权限
        changeAuthority(state, playload){
            state.hasPermission = playload.authoriy;
        },
        //改变登录状态
        changeLogin(state, playload){
            state.isLogin = playload.isLogin;
        }
    }
})

export default store;