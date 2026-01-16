<template>
    <v-row>
        <v-col cols="3" class="border-1 ml-1 mr-1">
            <v-text-field  label="Параметр шаблона"
                           clearable outlined
                           v-model="templateName"></v-text-field>
            <span class="red--text title" v-if="!templateName">Пожалуйста, укажите название параметра в шаблоне</span>
        </v-col>
        <v-col cols="2" class="border-1 ml-1 mr-1">
            <v-select      label="Тип параметра"
                           outlined
                           v-model="propertyType"
                           :items = "templatePropertyTypes"
                           :item-text="propertyTypeItem=>propertyTypeItem.name"
                           :item-value="propertyTypeItem=>propertyTypeItem.id"></v-select>
        </v-col>
        <v-col cols="6" v-if="propertyType == 1" class="border-1 ml-1 mr-1">
            <v-select       label="Столбец excel"
                           outlined
                           v-model="excelName"
                           :items = "excelHeaders"></v-select>
        </v-col>
        <v-col cols="6" v-if="propertyType == 2" class="border-1">
            <table-value  v-for="tableValue in values"
                         :excel-headers="excelHeaders"
                         :set-condition="setConditionForValue"
                         :condition="tableValue.condition"
                         :remove-header="removeTableHeader"
                         :set-header="updateTableHeader"
                         :add-header="addTableHeader"
                         :set-error="setValueError"
                          :set-header-error="setTableHeaderError"
                         :table="tableValue"
                          :remove-value="removeValue"
                         :key="tableValue.id"></table-value>
            <v-col cols="12" class="red--text" v-if="notExistsValuesWithoutConditions">Пожалуйста, добавьте хотя бы одну таблицу по умолчанию (без условий). Если у вас все таблицы с условиями, то нужно добавить ещё одну таблицу без условия.</v-col>
            <v-col cols="12" class="red--text" v-if="existsMoreThanOneValueWithCondition">Допустимо только одно значение без условий. Добавьте условие для одной из таблиц или удалите одну из таблиц.</v-col>
            <v-row align="center" justify="center">
                <v-col cols="8" offset-md="2" offset-lg="2">
                   <v-btn class="primary ml-5" @click.prevent="addValue">Добавить таблицу</v-btn>
                </v-col>
            </v-row>
        </v-col>
        <v-col cols="6" v-if="propertyType == 3" class="border-1 ml-1 mr-1">
            <text-value v-for="textValue in values"
                    :excel-headers="excelHeaders"
                    :set-condition="setConditionForValue"
                    :condition="textValue.condition"
                    :set-text-value="setText"
                    :text-id="textValue.id"
                    :text-value="textValue.text_value"
                        :remove-value="removeValue"
                    :key="textValue.id"></text-value>
            <v-col cols="12" class="red--text" v-if="notExistsValuesWithoutConditions">Пожалуйста, добавьте хотя бы одну текстовку по умолчанию (без условий). Если у вас все тексты с условиями, то нужно добавить ещё одну текстовку без условия.</v-col>
            <v-col cols="12" class="red--text" v-if="existsMoreThanOneValueWithCondition">Допустимо только одно значение без условий. Добавьте условие для одной из текстовок или удалите одну из текстовок.</v-col>
            <v-row align="center" justify="center">
                <v-col cols="8" offset-md="2" offset-lg="2">
                    <v-btn class="primary ml-5" @click.prevent="addValue">Добавить текст</v-btn>
                </v-col>
            </v-row>
        </v-col>
        <v-col cols="12">
            <v-btn class="red ml-5 float-right" @click.prevent="showRemovePropertyDialog">Удалить параметр</v-btn>
        </v-col>
        <accept-dialog
                :show-dialog="acceptDialog"
                :hide-dialog="hideAcceptDialog"
                :title="acceptTitle"
                :btn-text="acceptBtnText"
                :additional-text="additionalText"
                :on-success="removePropertyCallback"
        ></accept-dialog>
    </v-row>
</template>

<script>
    import {mapGetters} from "vuex";
    import {getNextId} from "@/helpers/collection_functions.js";
    import TextValue from "./text/TextValue";
    import TableValue from "./table/TableValue";
    import AcceptDialog from "../../common/AcceptDialog";

    export default {
        name: "TemplateProperty",
        components: {TableValue, TextValue, AcceptDialog},
        props: {
            propertyId: Number,
            setProperty: Function,
            excelHeaders: Array,
            initialProperty: Object,
            setError: Function,
            removeProperty: Function
        },
        computed: {
            ...mapGetters(['templatePropertyTypes']),
            notExistsValuesWithoutConditions() {
                return (this.propertyType === 2 || this.propertyType===3) && this.values.filter(value => !value.condition).length === 0
            },
            existsMoreThanOneValueWithCondition(){
                return (this.propertyType === 2 || this.propertyType===3) && this.values.filter(value => !value.condition).length > 1;
            }
        },
        watch: {
            templateName: {
                handler(){
                    this.setProperty(this.buildProperty());
                    this.check();
                }
            },
            propertyType: {
                handler(){
                    this.initValuesForPropertyType();
                }
            },
            excelName: {
                handler(){
                    this.setProperty(this.buildProperty());
                }
            }
        },
        mounted(){
            if(this.initialProperty){
                this.fillFromInitialProperty();
            }

            if(this.excelHeaders.length > 0){
                this.firstExcelHeader = this.excelHeaders[0];

                if(!this.excelName) {
                    this.excelName = this.firstExcelHeader;
                    this.setProperty(this.buildProperty());
                }

                if(!this.propertyType){
                    this.propertyType = 1;
                }
            }
        },
        data: () => ({
            templateName: '',
            propertyType: 1,
            excelName: '',
            values: [],
            firstExcelHeader: '',
            acceptDialog: false,
            acceptTitle: 'Удаление свойства',
            acceptBtnText: 'Удалить',
            additionalText: 'удалить данное свойство шаблона'
        }),
        methods: {
            fillFromInitialProperty(){
                this.excelName = this.initialProperty.excel_name;
                this.templateName = this.initialProperty.template_name;
                this.propertyType = this.initialProperty.type_id;
                this.values = Array.from(this.initialProperty.tableOrTextValues);
                this.check();
            },
            initValuesForPropertyType(){
                this.values = [];
                this.excelName = '';

                switch(this.propertyType){
                    case 2:
                        this.values.push(this.getDefaultTableValue());
                        break;
                    case 3:
                        this.values.push(this.getDefaultTextValue());
                        break;
                    default:
                        this.excelName = this.firstExcelHeader;
                }

                this.setProperty(this.buildProperty());
                this.check();
            },
            addValue(){
                let value = {};

                if(this.propertyType == 2){
                    value = this.getDefaultTableValue();
                } else {
                    value = this.getDefaultTextValue();
                }

                value.id = getNextId(this.values);
                this.values.push(value);
                this.check();
            },
            removeValue(valueId){
                let valueindex = 0;

                this.values.forEach((value, index) => {
                    if (value.id === valueId) {
                         valueindex = index;
                    }
                });

                this.values.splice(valueindex);
                this.check();
            },
            getDefaultTextValue(){
                return {id: 1, text_value: '', condition: '', error: false};
            },
            getDefaultTableValue(){
                let headers = this.getDefaultHeaders();
                return {id: 1, headers, condition: '', error: false};
            },
            getDefaultHeaders(){
                let excelName = this.firstExcelHeader;

                return [
                    {
                        id: 1,
                        excel_name: excelName,
                        template_name: '',
                        error: true
                    }
                ]
            },
            addTableHeader(tableId){
                let excelName = this.firstExcelHeader;

                this.values.forEach(value => {
                    if(value.id === tableId){
                        value.headers.push({
                            id: getNextId(value.headers),
                            excel_name: excelName,
                            template_name: '',
                            error: true
                        });
                    }
                });

                this.setProperty(this.buildProperty());
                this.check();
            },
            updateTableHeader(tableId, headerForUpdate){
                this.values.forEach(value => {
                    if(value.id === tableId) {
                        value.headers.forEach(header => {
                            if (header.id === headerForUpdate.id) {
                                   header.excel_name = headerForUpdate.excelName;
                                   header.template_name = headerForUpdate.templateName;
                            }
                        });
                    }
                });

                this.setProperty(this.buildProperty());
                this.check();
            },
            removeTableHeader(tableId, headerId){
                this.values.forEach(value => {
                    if(value.id === tableId) {
                        let headerIndex = -1;

                        value.headers.forEach((header, index) => {
                            if (header.id === headerId) {
                                headerIndex = index;
                            }
                        });

                        if(headerIndex >= 0){
                            value.headers.splice(headerIndex, 1);
                        }
                    }
                });

                this.setProperty(this.buildProperty());
                this.check();
            },
            setText(textId, text){
                this.values.forEach(value => {
                    if (value.id === textId) {
                         value.text_value = text;
                    }
                });

                this.setProperty(this.buildProperty());
                this.check();
            },
            setConditionForValue(valueId, condition){
                this.values.forEach(value => {
                    if (value.id === valueId) {
                          value.condition = condition;
                    }
                });

                this.setProperty(this.buildProperty());
                this.check();
            },
            buildProperty(){
                let self = this;
                return {
                    id: self.propertyId,
                    template_name: self.templateName,
                    type_id: self.propertyType,
                    excel_name: self.excelName,
                    tableOrTextValues: self.values
                }
            },
            setValueError(valueId, error){
                this.values.forEach(value => {
                    if(value.id === valueId){
                        value.error = error;
                    }
                });
                this.setProperty(this.buildProperty());
                this.check();
            },
            setTableHeaderError(valueId, headerId, error){
                this.values.forEach(value => {
                    if(value.id === valueId){
                        value.headers.forEach(header => {
                            if(header.id === headerId){
                                header.error = error;
                            }
                        })
                    }
                });
                this.setProperty(this.buildProperty());
                this.check();
            },
            check(){
                this.setError(this.propertyId, !this.templateName || ((this.propertyType===2 || this.propertyType===3)  && (this.isExistsValuesWithErrors() || this.values.filter(value => !value.condition).length === 0 || this.values.filter(value => !value.condition).length > 1)));
            },
            isExistsValuesWithErrors(){
                let propertyType = this.propertyType;
                return this.values.filter(value => value.error || (propertyType === 2 && value.headers.filter(header => header.error).length > 0)).length > 0;
            },
            showRemovePropertyDialog(){
                this.acceptDialog = true;
            },
            removePropertyCallback(){
                this.removeProperty(this.propertyId);
            },
            hideAcceptDialog(){
                this.acceptDialog = false;
            }
        }
    }
</script>

<style>
    .border-1{
        border: 1px solid #ccc;
        border-radius: 5px;
    }
</style>