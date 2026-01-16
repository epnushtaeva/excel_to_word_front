<template>
    <v-col cols="12" class="border-1 ml-1 mr-1">
        <h1>Шаблоны word:</h1>
        <v-row v-if="!existsTemplatesWithoutCondition">
            <v-col cols="12" class="red--text">
                Пожалуйста, добавьте хотя бы один шаблон по умолчанию (без условия). Если у вас все шаблоны с условиями, то нужно добавить ещё один шаблон без условия.
            </v-col>
        </v-row>
        <v-row v-if="existsMoreThanOneTemplateWithoutCondition">
            <v-col cols="12" class="red--text">
                Допустимо указание только одног шаблона без условий. Пожалуйста, добавьте условие для шаблона, или удалите один из шаблонов.
            </v-col>
        </v-row>
        <word-template
                v-for="template in templates"
                :excel-headers="excelHeaders"
                :set-condition="setCondition"
                :initial-template="template"
                :remove-template="removeTemplate"
                :set-template="setTemplate"
                :set-error="setTemplateError"
                :key="template.id"
        ></word-template>
        <v-row v-if="!existsTemplatesWithoutCondition">
            <v-col cols="12" class="red--text">
                Пожалуйста, добавьте хотя бы один шаблон по умолчанию (без условия). Если у вас все шаблоны с условиями, то нужно добавить ещё один шаблон без условия.
            </v-col>
        </v-row>
        <v-row v-if="existsMoreThanOneTemplateWithoutCondition">
            <v-col cols="12" class="red--text">
                Допустимо указание только одног шаблона без условий. Пожалуйста, добавьте условие для шаблона, или удалите один из шаблонов.
            </v-col>
        </v-row>
        <v-row align="center" justify="center">
            <v-col cols="12" class="red--text">
                <v-btn class="primary ml-5" @click.prevent="addTemplate">Добавить шаблон</v-btn>
            </v-col>
        </v-row>
    </v-col>
</template>

<script>
    import WordTemplate from "./WordTemplate";
    import {getNextId} from "../../../helpers/collection_functions";

    export default {
        components: {WordTemplate},
        props: {
            setTemplates: Function,
            excelHeaders: Array,
            initialTemplates: Array,
            setError: Function
        },
        name: "WordTemplates",
        computed: {
            existsTemplatesWithoutCondition(){
                return this.isExistsTemplatesWithoutCondition();
            },
            existsMoreThanOneTemplateWithoutCondition(){
                return this.isExistsMoreThanOneTemplateWithoutCondition();
            }
        },
        mounted(){
            if(this.initialTemplates.length > 0){
                let self = this;
                this.templates = [];

                this.initialTemplates.forEach(template => {
                    self.templates.push({
                        id: template.id,
                        file: template.file,
                        condition: template.condition,
                        error: template.error
                    });
                });
            } else {
                this.setTemplates(this.templates);
            }

            this.check();
        },
        data: () => ({
            templates: [{id: 1, file: null, condition: '', error: true}]
        }),
        methods: {
            setCondition(templateId, condition){
                this.templates.forEach(template => {
                    if(template.id === templateId){
                        template.condition = condition;
                    }
                });
                this.setTemplates(this.templates);
                this.check();
            },
            addTemplate(){
                let id = getNextId(this.templates);

                this.templates.push({
                    id,
                    file:null,
                    condition: '',
                    error: true
                });

                this.setTemplates(this.templates);
                this.check();
            },
            setTemplate(templateForUpdate){
                this.templates.forEach(template => {
                    if(template.id === templateForUpdate.id){
                        template.condition = templateForUpdate.condition;
                        template.file = templateForUpdate.file;
                    }
                });
                this.setTemplates(this.templates);
                this.check();
            },
            removeTemplate(templateId){
                let templateIndex = -1;

                this.templates.forEach((template, index) => {
                    if(template.id === templateId){
                        templateIndex = index;
                    }
                });

                this.templates.splice(templateIndex);
                this.check();
            },
            setTemplateError(templateId, error){
                this.templates.forEach(template => {
                    if(template.id === templateId){
                        template.error = error;
                    }
                });

                this.check();
            },
            check(){
                this.setError(!this.isExistsTemplatesWithoutCondition() || this.isExistsTemplatesWithErrors() || this.isExistsMoreThanOneTemplateWithoutCondition());
            },
            isExistsMoreThanOneTemplateWithoutCondition(){
                return this.templates.filter(template => template.condition.length === 0).length>1;
            },
            isExistsTemplatesWithoutCondition(){
                return this.templates.filter(template => template.condition.length === 0).length>0;
            },
            isExistsTemplatesWithErrors(){
                return this.templates.filter(template => template.error).length>0;
            }
        }
    }
</script>

<style scoped>

</style>