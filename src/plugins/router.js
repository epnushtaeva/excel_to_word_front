import Vue from "vue";
import VueRouter from "vue-router";
import ExcelListsPage from "@/components/pages/ExcelListsPage";
import LoadExcelPage from "@/components/pages/LoadExcelPage";
import LoginPage from "@/components/pages/LoginPage";
import {check} from "@/helpers/requests_to_server"
Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        {
            path: "/",
            name: "main",
            component: ExcelListsPage,
            beforeEnter:check
        },
        {
            path: "/login",
            name: "login",
            component: LoginPage,
            beforeEnter:check
        },
        {
            path: "/load_excel",
            name: "load_excel",
            component: LoadExcelPage,
            beforeEnter:check
        }
    ],
    mode: "history"
});

export default router;