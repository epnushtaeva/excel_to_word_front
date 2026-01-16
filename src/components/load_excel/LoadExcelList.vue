<template>
    <v-row>
        <v-col cols="12" class="ml-1 mr-1">
            <v-row class="load_list_row ml-1 mr-2">
                <v-col cols="12" class="">
                    <h2>1. Загрузите файл со списком:</h2>
                </v-col>
                <v-col cols="12">
                    <v-file-input
                            label="Нажмите, чтобы загрузить/заменить файл excel"
                            outlined
                            dense
                            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            @change = "setExcelFile($event)"
                            :value="excelFile"
                    ></v-file-input>
                    <span class="red--text title" v-if="!!excelHeadersError">{{excelHeadersError}}</span>
                    <span class="blue--text title">В excel заголовки должны начинаться с первой строки. Пропуски строк и дополнительные надписи до заголовков недопустимы.</span>
                </v-col>
                <v-col cols="12">
                    <v-progress-circular
                            indeterminate
                            color="blue lighten-5"
                            v-if="loadingExcelForHeaders"
                    ></v-progress-circular>
                    <v-btn class="primary ml-5 float-right" :disabled="!excelFile || loadingExcelForHeaders" @click.prevent="loadExcelForHeaders">Загрузить список</v-btn>
                </v-col>
            </v-row>
            <v-row v-if="excelHeaders.length > 0">
                <v-col cols="12">
                    <h2>2. Загрузите шаблоны и заполните параметры шаблонов:</h2>
                </v-col>

            </v-row>
            <v-row v-if="excelHeaders.length > 0" class="load_list_row ml-1 mr-2 mb-3">
                <v-col cols="12">
                    <v-select       label="Столбец excel, из которого нужно брать название директории"
                                    outlined
                                    v-model="subDirectoryName"
                                    :items = "subDirectoryNames"></v-select>
                    <span class="blue--text title">Необязательный параметр</span>
                </v-col>
            </v-row>
            <v-row v-if="excelHeaders.length > 0" class="load_list_row ml-1 mr-2">
                <word-templates
                        :excel-headers="excelHeaders"
                        :initial-templates="templates"
                        :set-templates="setTemplates"
                        :set-error="setTemplateError"
                ></word-templates>
            </v-row>
            <v-row v-if="excelHeaders.length > 0" class="load_list_row ml-1 mr-2">
                <template-properties
                        :excel-headers="excelHeaders"
                        :set-properties="setProperties"
                        :initial-properties="properties"
                        :set-error="setPropertiesError"
                ></template-properties>
            </v-row>
            <v-row v-if="showSuccessMessage" class="load_list_row ml-1 mr-2">
                <v-col cols="12" class="green--text title">Список был успешно загружен в очередь на обработку. Его статус можно узнать на странице "Результаты обработки".
                </v-col>
            </v-row>
            <v-row v-if="excelHeaders.length > 0">
                <v-col cols="12">
                    <v-progress-circular
                            indeterminate
                            color="blue lighten-5"
                            v-if="listSaving"
                    ></v-progress-circular>
                    <v-btn class="primary ml-5 float-right" :disabled="templateError || propertiesError || listSaving" @click.prevent="saveExcelList">Поставить список в очередь на обработку</v-btn>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>

<script>
    import WordTemplates from "../load_excel/templates/WordTemplates";
    import TemplateProperties from "./template_properties/TemplateProperties";
    import {mapActions} from "vuex";
    import {conditionToString} from "../../helpers/collection_functions";

    export default {
        components:{TemplateProperties, WordTemplates},
        name: "LoadExcelList",
        data: () => ({
            excelFile: null,
            loadingExcelForHeaders: false,
            listSaving: false,
            excelHeaders: [],
            templates: [],
            properties: [],
            templateError: true,
            propertiesError: false,
            excelHeadersError: '',
            subDirectoryName: '',
            subDirectoryNames: [],
            showSuccessMessage: false
        }),
        methods: {
            ...mapActions(['getExcelHeaders', 'saveListToDataBase']),
            setExcelFile(file){
                if(file) {
                    let fileExtension = file.name.split(".").pop();

                    if (!['xlsx'].includes(fileExtension)) {
                        this.$confirm(
                            `Файл имеет недопустимое расширение. Допустимые расширения: xlsx`,
                            {
                                title: "Ошибка",
                                buttonTrueText: "",
                                icon: "mdi-information-outline",
                                buttonFalseColor: "error",
                                buttonFalseText: "Закрыть",
                                buttonFalseFlat: false
                            }
                        );
                        return true;
                    }

                    this.excelFile = file;
                }
            },
            resetData(){
                this.subDirectoryName = '';
                this.templates = [];
                this.properties = [];
                this.templateError = true;
                this.propertiesError = false;
                this.excelHeaders = [];
                this.subDirectoryNames = [];
            },
            async loadExcelForHeaders(){
                this.showSuccessMessage = false;
                this.excelHeadersError = '';
                this.resetData();
                this.loadingExcelForHeaders = true;
                this.excelHeaders = await this.getExcelHeaders(this.excelFile);
                this.loadingExcelForHeaders = false;

                if(this.excelHeaders.length === 0){
                    this.excelHeadersError = 'Файл не содержит ни одной строки.'
                } else {
                    let self = this;
                    self.subDirectoryNames.unshift('');

                    this.excelHeaders.forEach(header => {
                        self.subDirectoryNames.push(header);
                    })
                }
            },
            async saveExcelList(){
                 this.listSaving = true;
                 await this.saveListToDataBase(this.toFormData());
                 this.listSaving = false;
                 this.resetData();
                 this.excelFile = null;
                 this.showSuccessMessage = true;
            },
            setTemplates(templates){
                this.templates = templates;
            },
            setProperties(properties){
                this.properties = properties;
            },
            setTemplateError(templateError){
                this.templateError = templateError;
            },
            setPropertiesError(propertiesError){
                this.propertiesError = propertiesError;
            },
            toFormData(){
                let loadListData = new FormData();
                let self = this;
                loadListData.append('excel_list', this.excelFile);
                loadListData.append('sub_dir_column', this.subDirectoryName);

                this.templates.forEach((template, index) => {
                    loadListData.append(`templates[${index}][template]`, template.file);
                    loadListData.append(`templates[${index}][template_condition]`, conditionToString(template.condition));
                });

                this.properties.forEach((property, index) => {
                    loadListData.append(`properties[${index}][excel_name]`, property.excel_name);
                    loadListData.append(`properties[${index}][template_name]`, property.template_name);
                    loadListData.append(`properties[${index}][type_id]`, property.type_id);

                    if(property.type_id !== 1){
                         self.putValues(loadListData, index, property.tableOrTextValues, property.type_id === 2)
                    }
                });

                return loadListData;
            },
            putValues(formData, propertyIndex, values, isTable){
                let self = this;

                values.forEach((value, index) => {
                    formData.append(`properties[${propertyIndex}][values][${index}][condition]`, conditionToString(value.condition));

                    if (isTable){
                           self.putTableHeaders(formData, propertyIndex, index, value.headers);
                    } else {
                          formData.append(`properties[${propertyIndex}][values][${index}][text]`, value.text_value);
                    }
                });
            },
            putTableHeaders: function (formData, propertyIndex, tableIndex, headers) {
                headers.forEach((header, index) => {
                    formData.append(`properties[${propertyIndex}][values][${tableIndex}][headers][${index}][excel_name]`, header.excel_name);
                    formData.append(`properties[${propertyIndex}][values][${tableIndex}][headers][${index}][template_name]`, header.template_name);
                });
            }
        }
    }
</script>

<style>
    .load_list_row{
        background: #ffffff !important;
    }


</style>