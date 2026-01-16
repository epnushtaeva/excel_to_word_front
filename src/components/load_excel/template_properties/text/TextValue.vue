<template>
    <v-row>
        <v-col cols="12">
            <h2>Текст {{textId}}:</h2>
        </v-col>
        <v-col cols="5" class="border-1 ml-1 mr-1">
            <h3>Укажите текст:</h3>
            <v-textarea
                    outlined
                    clearable
                    v-model="value"
                    label="Текст"
            ></v-textarea>
        </v-col>
        <v-col cols="6" class="border-1 ml-1 mr-1">
            <h3>Дополнительное условие для отображения текста:</h3>
            <h4 class="mb-3 mt-2 indigo--text subtitle-2">Вы можете задать дополнительные условия, например: Столбец1 = 'Значение'.  Записи будут дополнительно отфильтрованы по заданному условию, и в зависимости от условия в документы будет добавлена разная текстовка.</h4>
            <additional-condition
                    v-if="Array.isArray(condition)"
                    :condition-for="'table'"
                    :set-condition="setConditionCallback"
                    :excel-headers="excelHeaders"
                    :initial-conditions="condition"
                    :remove-condition="removeCondition"
            >
            </additional-condition>
            <h4 class="text-center text--secondary mt-4 mb-3" v-if="!Array.isArray(condition)">Этот текст будет добавлен по умолчанию(условие не задано)</h4>
            <v-row align="center" justify="center">
                <v-col cols="10" offset-md="1" offset-lg="1">
                     <v-btn class="primary ml-5" @click.prevent="addCondition" v-if="!Array.isArray(condition)">Добавить условие</v-btn>
                </v-col>
            </v-row>
        </v-col>
        <v-col cols="12">
            <v-btn class="red ml-5 float-right" @click.prevent="showRemoveTextDialog">Удалить текст</v-btn>
        </v-col>
        <accept-dialog
                :show-dialog="acceptDialog"
                :hide-dialog="hideAcceptDialog"
                :title="acceptTitle"
                :btn-text="acceptBtnText"
                :additional-text="additionalText"
                :on-success="removeText"
        ></accept-dialog>
    </v-row>
</template>

<script>
    import AdditionalCondition from "../condition/AdditionalCondition";
    import AcceptDialog from "../../../common/AcceptDialog";

    export default {
        components: {AdditionalCondition, AcceptDialog},
        props: {
            textId: Number,
            textValue: String,
            excelHeaders: Array,
            setCondition: Function,
            condition: [Array, String],
            setTextValue: Function,
            removeValue: Function
        },
        watch: {
            value: {
                handler(){
                    this.setTextValue(this.textId, this.value);
                }
            }
        },
        mounted(){
            this.value = this.textValue;
        },
        name: "TextValue",
        data: () => ({
            value: '',
            acceptDialog: false,
            acceptTitle: 'Удаление свойства',
            acceptBtnText: 'Удалить',
            additionalText: 'удалить данное свойство шаблона'
        }),
        methods: {
            setConditionCallback(condition){
                this.setCondition(this.textId, condition);
            },
            removeCondition(){
                this.setCondition(this.textId, '');
            },
            addCondition(){
                this.setCondition(this.textId, []);
            },
            showRemoveTextDialog(){
                this.acceptDialog = true;
            },
            removeText(){
                this.removeValue(this.textId);
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