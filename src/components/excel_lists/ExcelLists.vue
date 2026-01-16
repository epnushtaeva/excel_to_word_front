<template>
    <v-row>
        <v-col cols="12" class="mb-3">
            <h1>Загруженые вами списки excel:</h1>
        </v-col>
        <v-col cols="12" md="4" sm="12" lg="4" offset-lg="4" offset-md="4" offset-sm="0" class="mt-5">
            <v-progress-circular
                    indeterminate
                    color="primary"
                    v-if="tableLoading"
            ></v-progress-circular>
            <v-pagination :length="pagesCount" v-model="options.page" v-if="options.page" :total-visible="7">
            </v-pagination>
        </v-col>
        <v-col cols="12">
            <v-data-table :headers="excelListsHeaders"
                          :items="excelLists"
                          :items-per-page="10"
                          :server-items-length="excelListsCount"
                          :options.sync="options"
                          :loading = "tableLoading"
                          item-key="id"
                          hide-default-footer
                          mobile-breakpoint="0"
                          class="elevation-1 mt-5 lists-table">
                <template v-slot:item.zip_path="{item}">
                    <v-progress-circular
                            indeterminate
                            color="primary"
                            v-if="listsIdsForZipDownloading.includes(item.id)"
                    ></v-progress-circular>
                      <v-btn class="primary ml-1" v-if="!!item.zip_path" @click.prevent="downloadZip(item.id)" :disabled="listsIdsForZipDownloading.includes(item.id)">Скачать сформированные файлы</v-btn>
                </template>
            </v-data-table>
        </v-col>
        <v-col cols="12" md="4" sm="12" lg="4" offset-lg="4" offset-md="4" offset-sm="0" class="mt-5">
            <v-pagination :length="pagesCount" v-model="options.page" v-if="options.page" :total-visible="7">
            </v-pagination>
        </v-col>
    </v-row>
</template>

<script>
    import {mapGetters, mapActions} from "vuex";

    export default {
        name: "ExcelLists",
        computed: {
            ...mapGetters(['excelListsHeaders', 'excelLists', 'excelListsCount', 'listsIdsForZipDownloading']),
            pagesCount(){
                let pagesCount = parseInt(Math.ceil(this.excelListsCount/10));
                return pagesCount;
            }
        },
        watch: {
            'options.page': {
                   handler(){
                       this.loadExcelLists();
                   }
            }
        },
        data:() => ({
            options: {},
            tableLoading: false
        }),
        methods: {
            ...mapActions(['getExcelLists', 'startZipDownloading', 'endZipDownloading', 'downloadZipResult']),
            async downloadZip(listId){
                  this.startZipDownloading(listId);
                  await this.downloadZipResult(listId);
                  this.endZipDownloading(listId);
            },
            async loadExcelLists(){
                let { page } = this.options;

                if(page) {
                    this.tableLoading = true;
                    await this.getExcelLists({
                        length: 10,
                        start: (page - 1) * 10
                    });
                    this.tableLoading = false;
                }
            }
        }
    }
</script>

<style>
    .lists-table tr:nth-child(n+1) th, .lists-table .v-data-footer{
        background: #E8EAF6;
    }

    .lists-table tr:nth-child(n) td{
        background: #FCE4EC;
        border: 1px solid #cccccc !important;
    }

    .lists-table tr:nth-child(2n) td{
        background: #F3E5F5;
        border: 1px solid #cccccc !important;
    }

    .lists-table tr th{
        border: 1px solid #cccccc !important;
    }

    .mdi-cursor-pointer{
        cursor: pointer !important;
    }

    .small-font tbody tr td{
        font-size: 12pt !important;
    }

    .small-font thead tr th{
        font-size: 12pt !important;
    }
</style>