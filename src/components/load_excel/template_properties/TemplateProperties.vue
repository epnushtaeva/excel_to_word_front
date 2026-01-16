<template>
    <v-col cols="12" class="border-1 ml-1 mr-1">
        <h2>Параметры шаблонов:</h2>
        <v-col cols="12" class="red--text mb-2">Названия параметров в шаблоне необходимо указывать без ${}. Например: если в шаблоне параметр равен ${test}, то в поле "Параметр шаблона" нужно указать просто значение "test".</v-col>
        <v-col cols="12" class="red--text" v-if="notExistsColumnsWithColumnType">Пожалуйста, укажите хотя бы один параметр с типом "Столбец"</v-col>
        <template-property
                v-for="property in properties"
                :excel-headers="excelHeaders"
                :initial-property="property"
                :property-id="property.id"
                :set-property="setProperty"
                :set-error="setErrorCallback"
                :remove-property="removeProperty"
                :key="property.id"
        ></template-property>
        <v-col cols="12" class="red--text" v-if="notExistsColumnsWithColumnType">Пожалуйста, укажите хотя бы один параметр с типом "Столбец"</v-col>
        <v-row align="center" justify="center">
            <v-col cols="12">
                <v-btn class="primary ml-5" @click.prevent="addProperty">Добавить параметр</v-btn>
            </v-col>
        </v-row>
    </v-col>
</template>

<script>
    import {getNextId} from "../../../helpers/collection_functions";
    import TemplateProperty from "./TemplateProperty";

    export default {
        name: "TemplateProperties",
        components: {TemplateProperty},
        props: {
            excelHeaders: Array,
            setProperties: Function,
            initialProperties: Array,
            setError: Function
        },
        computed: {
            notExistsColumnsWithColumnType(){
                return this.properties.filter(property => property.type_id === 1).length === 0;
            }
        },
        mounted(){
            let self = this;

            if(this.initialProperties.length > 0){
                self.properties = [];
            }

            this.initialProperties.forEach(property => {
                self.properties.push(property);
            });

            if(this.excelHeaders.length > 0){
                this.firstExcelHeader = this.excelHeaders[0];
            }

            if(this.properties.length === 0){
                this.addProperty();
            }
        },
        data: () => ({
            properties: [],
            firstExcelHeader: ''
        }),
        methods: {
            setErrorCallback(propertyId, error){
                this.properties.forEach(property => {
                    if (property.id === propertyId) {
                        property.error = error;
                    }
                });
                this.setProperties(this.properties);
                this.check();
            },
            setProperty(propertyForUpdate){
                this.properties.forEach(property => {
                    if(property.id === propertyForUpdate.id){
                        property.excel_name = propertyForUpdate.excel_name;
                        property.template_name = propertyForUpdate.template_name;
                        property.type_id = propertyForUpdate.type_id;
                        property.tableOrTextValues = propertyForUpdate.tableOrTextValues;
                    }
                });
                this.setProperties(this.properties);
                this.check();
            },
            addProperty(){
                let self = this;
                this.properties.push({id: getNextId(self.properties), type_id:1, excel_header: self.firstExcelHeader, template_name: '',  tableOrTextValues: [],  error: true});
                this.setProperties(this.properties);
                this.check();
            },
            removeProperty(propertyId){
                let indexForRemove = -1;

                this.properties.forEach((property, index) => {
                    if(property.id === propertyId){
                        indexForRemove = index;
                    }
                });

                if(indexForRemove >= 0){
                    this.properties.splice(indexForRemove, 1);
                }

                this.setProperties(this.properties);
                this.check();
            },
            check(){
                this.setError(this.properties.filter(property => property.error).length>0 || this.properties.filter(property => property.type_id === 1).length === 0);
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