<template>
    <v-app class="app">
      <v-main>
          <Header v-if="!!token"></Header>
          <router-view class="mt-13 pt-3 main-app"></router-view>
          <Footer v-if="!!token"></Footer>
      </v-main>
    </v-app>
</template>

<script>
import Footer from "./components/common/Footer";
import Header from "./components/common/Header";
import {mapGetters} from "vuex";

export default {
     name: 'App',
    components: {Header, Footer},
    computed: {
         ...mapGetters(['token'])
    }
}
</script>

<style>
    .app{
        background: #B0BEC5 !important;
    }

    .v-label, .v-text-field__slot input, .v-data-table-header th, .v-data-table__wrapper td, .v-data-footer__select, .v-data-footer__pagination, .v-select__selection, .v-data-footer__icons-before .v-btn__content, .v-data-footer__icons-after .v-btn__content{
        color: #000 !important;
        font-size: 15pt !important;
    }

    .main-app{
        min-height: 88.1vh !important;
    }
</style>
