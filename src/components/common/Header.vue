<template>
    <v-app-bar
            color="blue darken-1"
            dark
            absolute elevate-on-scroll
    >
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
        <span class="title">ExcelToWord Online</span>

        <v-spacer></v-spacer>
        <v-btn text class="white--text title" href="/load_excel">ЗАГРУЗКА EXCEL</v-btn>
        <v-spacer></v-spacer>
    </v-app-bar>
</template>

<script>
    export default {
        name: "Header"
    }
</script>

<style scoped>

</style>