<template lang="">
    <div>
        <el-card shadow="always" :body-style="{ padding: '20px'}">
            <div slot="header">
                <span><!-- card title --></span>
            </div>
            <v-chart :option="option_column" style="height: 400px"></v-chart>
        </el-card>
         <v-chart :option="option" style="height: 400px"></v-chart>
    </div>
</template>
<script lang="ts" setup>
import { Edit, User } from "@element-plus/icons-vue/dist/types";
import { DOMNodeTransforms } from "@vue/compiler-dom";
import axios from "axios";
import { ElLoading, ElMessageBox, ElTable, ElMessage } from "element-plus";
import { fa, tr } from "element-plus/lib/locale";
import { serve } from "esbuild";
import type { FormInstance, FormRules } from "element-plus";
import type { TableColumnCtx } from "element-plus/es/components/table/src/table-column/defaults";
import {
  computed,
  onMounted,
  reactive,
  ref,
  toRaw,
  toRef,
  toRefs,
} from "vue-demi";
import store from "../../store";
import router from "../../router";
import { find } from "lodash";
import * as echarts from 'echarts';

const productInfo = reactive({
  data: [],
});

const productx = reactive({
    data:[],
})

const producty = reactive({
    data:[],
})

const option_column={
    title: { text: "仓库库存统计" },
    tooltip: {},
    xAxis: {
        data: productx.data,
    },
    yAxis: {},
    series: [
        {
        name: "销量",
        type: "bar",
        data: producty.data,
        },
    ],
};



const getProData = async ()=>{
    const res = await axios.get("http://localhost:8080/product/sortByPrice");
    productInfo.data = res.data;
    for(let i = 0; i < productInfo.data.length; i++){
        productx.data.push(productInfo.data[i].product_name);
        producty.data.push(productInfo.data[i].product_price);
    }
    console.log(productx.data);
    
}

onMounted(()=>{
    getProData();
})

</script>
<style lang="">

</style>