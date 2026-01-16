<template>
        <v-row>
            <v-col cols="5">
                <v-text-field  label="Заголовок в word"
                               clearable outlined
                               v-model="templateName"></v-text-field>
                <span class="red--text title" v-if="!templateName">Пожалуйста, укажите соответствующий заголовок таблицы word</span>
            </v-col>
            <v-col cols="6">
                <v-select      label="Столбец из excel"
                               outlined
                               v-model="excelName"
                               :items = "excelHeaders"></v-select>
            </v-col>
            <v-col cols="12">
                <v-btn class="red ml-2 float-right" @click.prevent="removeHeader(header.id)">Удалить столбец</v-btn>
            </v-col>
        </v-row>
</template>

<script>
    export default {
        props:{
            header: Object,
            setHeader: Function,
            removeHeader: Function,
            excelHeaders: Array,
            setError: Function
        },
        name: "TableHeader",
        watch:{
            excelName: {
                handler(){
                      this.updateHeader();
                }
            },
            templateName: {
                handler(){
                    this.updateHeader();
                    this.check();
                }
            }
        },
        mounted() {
            this.excelName = this.header.excel_name;
            this.templateName = this.header.template_name;
            this.check();
        },
        data: () => ({
            templateName: '',
            excelName: ''
        }),
        methods: {
            updateHeader(){
                let header = this.header;
                let excelName = this.excelName;
                let templateName = this.templateName;

                this.setHeader({
                    id: header.id,
                    excelName,
                    templateName
                });
            },
            check(){
                if(!this.templateName){
                    this.setError(this.header.id, true);
                } else {
                    this.setError(this.header.id, false);
                }
            }
        }
    }
</script>

<style scoped>

</style>