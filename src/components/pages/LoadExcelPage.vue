<template>
    <v-row>
        <v-col cols="12">
           <load-excel-list></load-excel-list>
        </v-col>
    </v-row>
</template>

<script>
    import LoadExcelList from "../load_excel/LoadExcelList";

    export default {
        name: "LoadFilePage",
        components: {LoadExcelList}
    }
</script>

<style>

</style>