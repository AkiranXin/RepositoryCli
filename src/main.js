import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import { createStore } from "vuex";
import store from './store'

const app = createApp(App)

app.use(store)
app.use(ElementPlus)
app.use(router)


app.mount('#app')