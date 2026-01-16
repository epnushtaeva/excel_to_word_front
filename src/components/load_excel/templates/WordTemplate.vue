<template>
    <v-row class="border-1 ml-1 mr-1">
        <v-col cols="12">
            <h2>Шаблон {{initialTemplate.id}}:</h2>
        </v-col>
        <v-col cols="4" class="border-1 ml-1 mr-1">
            <v-file-input
                    label="Нажмите, чтобы загрузить/заменить шаблон"
                    outlined
                    dense
                    accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    @change = "loadTemplate($event)"
                    :value="file"
            ></v-file-input>
            <span class="red--text title" v-if="!file">Пожалуйста, загрузите файл шаблона</span>
        </v-col>
        <v-col cols="7" class="border-1 ml-1 mr-1">
            <h3>Условие для использования шаблона:</h3>
            <h4 class="mb-3 mt-2 indigo--text subtitle-2">Вы можете задать дополнительные условия, например: Столбец1 = 'Значение'. И тогда для записей с соответствующим условием будет использоваться этот шаблон.</h4>
            <additional-condition
                    v-if="Array.isArray(condition)"
                    :condition-for="'template'"
                    :set-condition="setConditionCallback"
                    :excel-headers="excelHeaders"
                    :initial-conditions="condition"
                    :remove-condition="removeCondition"
            >
            </additional-condition>
            <h4 class="text-center text--secondary mt-4 mb-3" v-if="!Array.isArray(condition)">Этото шаблон будет использоваться по умолчанию (условие не задано)</h4>
            <v-row align="center" justify="center">
                <v-col cols="5" offset-md="2" offset-lg="2">
                    <v-btn class="primary ml-5" @click.prevent="addCondition" v-if="!Array.isArray(condition)">Добавить условие</v-btn>
                </v-col>
            </v-row>
        </v-col>
        <v-col cols="12">
                    <v-btn class="red mr-2 float-right" @click.prevent="acceptDialog=true">Удалить шаблон</v-btn>
        </v-col>
        <accept-dialog
                :show-dialog="acceptDialog"
                :hide-dialog="hideAcceptDialog"
                :title="acceptTitle"
                :btn-text="acceptBtnText"
                :additional-text="additionalText"
                :on-success="removeTemplateCallback"
        ></accept-dialog>
    </v-row>
</template>

<script>
    import AdditionalCondition from "../template_properties/condition/AdditionalCondition";
    import AcceptDialog from "../../common/AcceptDialog";

    export default {
        components: {AdditionalCondition, AcceptDialog},
        props: {
            initialTemplate: Object,
            setTemplate: Function,
            setCondition: Function,
            excelHeaders: Array,
            removeTemplate: Function,
            setError: Function
        },
        name: "WordTemplate",
        mounted(){
            if(this.initialTemplate.file){
                this.file = this.initialTemplate.file;
            }

            if(this.initialTemplate.condition) {
                this.condition = this.initialTemplate.condition;
            }
        },
        data: () => ({
            file: null,
            condition: '',
            acceptDialog: false,
            acceptTitle: 'Удаление шаблона',
            acceptBtnText: 'Удалить',
            additionalText: 'удалить данный шаблон'
        }),
        methods: {
            loadTemplate(file){
                if(file) {
                    let fileExtension = file.name.split(".").pop();

                    if (!['docx'].includes(fileExtension)) {
                        this.$confirm(
                            `Файл имеет недопустимое расширение. Допустимые расширения: docx`,
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

                    this.file = file;
                    this.setTemplate(this.buildTemplate());
                }

                this.check();
            },
            addCondition(){
                this.condition = [];
                this.setCondition(this.initialTemplate.id, []);
            },
            removeCondition(){
                this.condition = '';
                this.setCondition(this.initialTemplate.id, '');
            },
            setConditionCallback(condition){
                this.condition = condition;
                this.setCondition(this.initialTemplate.id, condition);
            },
            buildTemplate(){
                let self = this;

                return {
                    id: self.initialTemplate.id,
                    file: self.file,
                    condition: self.condition
                }
            },
            hideAcceptDialog(){
              this.acceptDialog = false;
            },
            removeTemplateCallback(){
                   this.removeTemplate(this.initialTemplate.id);
            },
            check(){
                if(!this.file){
                    this.setError(this.initialTemplate.id, true);
                } else {
                    this.setError(this.initialTemplate.id, false);
                }
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