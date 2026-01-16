<template>
    <v-row class="border-1">
        <v-col cols="12">
        <h2>Таблица {{table.id}}:</h2>
        </v-col>
        <v-col cols="6" class="border-1">
            <h3>Укажите столбцы таблицы:</h3>
            <span class="red--text title" v-if="table.headers.length === 0">Пожалуйста, добавьте хотя бы один столбец таблицы</span>
            <table-header v-for="header in table.headers"
                          :excel-headers="excelHeaders"
                          :set-header="setHeaderForTable"
                          :remove-header="removeHeaderForTable"
                          :set-error="setHeaderErrorCallback"
                          :header="header"
                          :key="header.id"
            ></table-header>
            <v-row align="center" justify="center">
                <v-col cols="10" offset-md="1" offset-lg="1">
                       <v-btn class="primary ml-5" @click.prevent="addHeaderForTableCallback">Добавить столбец</v-btn>
                   </v-col>
            </v-row>
        </v-col>
        <v-col cols="5" class="border-1">
            <h3>Дополнительное условие для отображения таблицы:</h3>
            <h4 class="mb-3 mt-2 indigo--text subtitle-2">Вы можете задать дополнительные условия, например: Столбец1 = 'Значение'. И в конечную таблицу будут добавлены только записи, для которых условие выполняется. Если аких записей нет, то эта таблица добавляться в документ не будет.</h4>
            <additional-condition
                      v-if="Array.isArray(condition)"
                      :condition-for="'table'"
                      :set-condition="setConditionCallback"
                      :excel-headers="excelHeaders"
                      :initial-conditions="condition"
                      :remove-condition="removeCondition"
            >
            </additional-condition>
            <h4 class="text-center text--secondary mt-4 mb-3" v-if="!Array.isArray(condition)">Эта таблица будет добавлена по умолчанию (условие не задано)</h4>
            <v-row align="center" justify="center">
                <v-col cols="10" offset-md="1" offset-lg="1">
                     <v-btn class="primary ml-5" @click.prevent="addCondition" v-if="!Array.isArray(condition)">Добавить условие</v-btn>
                </v-col>
            </v-row>
        </v-col>
        <v-col cols="12">
            <v-btn class="red ml-5 float-right" @click.prevent="showRemoveTableDialog">Удалить таблицу</v-btn>
        </v-col>
        <accept-dialog
                :show-dialog="acceptDialog"
                :hide-dialog="hideAcceptDialog"
                :title="acceptTitle"
                :btn-text="acceptBtnText"
                :additional-text="additionalText"
                :on-success="removeTable"
        ></accept-dialog>
    </v-row>
</template>

<script>
    import TableHeader from "./TableHeader";
    import AdditionalCondition from "../condition/AdditionalCondition";
    import AcceptDialog from "../../../common/AcceptDialog";

    export default {
        components: {AdditionalCondition, TableHeader, AcceptDialog},
        props: {
            addHeader: Function,
            setHeader: Function,
            removeHeader: Function,
            table: Object,
            excelHeaders: Array,
            setCondition: Function,
            condition: [Array, String],
            removeValue: Function,
            setHeaderError: Function,
            setError: Function
        },
        name: "TableValue",
        data: () => ({
            acceptDialog: false,
            acceptTitle: 'Удаление таблицы',
            acceptBtnText: 'Удалить',
            additionalText: 'удалить таблицу'
        }),
        methods: {
            setHeaderForTable(header){
                this.setHeader(this.table.id, header);
            },
            removeHeaderForTable(headerId){
                this.removeHeader(this.table.id, headerId);
                this.check();
            },
            addHeaderForTableCallback(){
                this.addHeader(this.table.id);
                this.check();
            },
            setConditionCallback(condition){
                this.setCondition(this.table.id, condition);
            },
            removeCondition(){
                this.setCondition(this.table.id, '');
            },
            addCondition(){
                this.setCondition(this.table.id, []);
            },
            showRemoveTableDialog(){
                this.acceptDialog = true;
            },
            removeTable(){
                this.removeValue(this.table.id);
            },
            hideAcceptDialog(){
                this.acceptDialog = false;
            },
            check(){
                this.setError(this.table.id, this.table.headers.length === 0);
            },
            setHeaderErrorCallback(headerId, error){
                this.setHeaderError(this.table.id, headerId, error);
            }
        }
    }
</script>

<style>
   .border-1{
       border: 1px solid #ccc;
       border-radius: 5px;
       margin: 3px !important;
   }
</style>