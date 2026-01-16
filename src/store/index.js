import Vue from "vue";
import Vuex from "vuex";
import template from "@/store/entities/template.js";
import excel_list from "@/store/entities/excel_list.js";
import login from "@/store/login.js";
Vue.use(Vuex);

export default new Vuex.Store({
    strict: true,
    state: {},
    mutations: {},
    actions: {},
    modules: {
        template,
        excel_list,
        login
    }
});
