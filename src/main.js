import Vue from 'vue'
import "@mdi/font/css/materialdesignicons.css";
import 'vuetify/dist/vuetify.min.css'
import ru from 'vuetify/src/locale/ru.ts'
import Vuetify from 'vuetify'
import router from '@/plugins/router.js'
import store from "@/store/";
import VuetifyConfirm from "vuetify-confirm";
require('@/plugins/VueTheMask.js')
// import FilteredTable from '@/components/common/filtered-table/FilteredTable'
// Vue.component('filtered-table', FilteredTable)
import App from './App.vue'

let  vuetify = new Vuetify({
  lang: {
    locales: {ru}
  }
});

Vue.use(Vuetify);
Vue.use(VuetifyConfirm, {
  vuetify,
});

new Vue({
  render: h => h(App),
  vuetify: vuetify,
  router,
  store,
  created() {
     this.$vuetify.lang.current = 'ru';
     this.$store.dispatch("initTokenFromLocalStorage");
  }
}).$mount('#app');
