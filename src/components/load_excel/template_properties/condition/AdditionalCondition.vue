<template>
    <v-row>
        <v-col cols="12" v-for="(condition, index) in conditions" :key="index">
            <condition-operator
                    v-if="Array.isArray(condition)"
                    :initial-value="condition"
                    :excel-headers="excelHeaders"
                    :operator-index="index"
                    :set-operator="setOperator"
            ></condition-operator>
            <v-row v-else>
                <v-col cols="12" v-if="!logicalOperators.includes(condition)"><h3 class="text-center">{{condition}}</h3></v-col>
                <v-col cols="12" v-if="logicalOperators.includes(condition)">
                    <v-select      label="Логический оператор"
                                   outlined
                                   :value="condition"
                                   :items = "logicalOperators"
                                   @change="setLogicalOperator($event, index)"
                    ></v-select>
                </v-col>
            </v-row>
        </v-col>
        <v-col cols="12" class="align-center">
            <v-btn class="primary ml-1 mt-1" @click.prevent="addCondition">Добавить условие</v-btn>
            <v-btn class="info ml-1 mt-1" @click.prevent="addQuotes">Обернуть в скобки</v-btn>
            <v-btn class="yellow ml-1 mt-1" @click.prevent="addNo">Обернуть в НЕ</v-btn>
        </v-col>
        <v-col cols="6" offset-md="3" offset-lg="3">
            <v-btn class="red ml-2" @click.prevent="showResetConditionDialog">Сбросить условие</v-btn>
        </v-col>
        <v-col cols="6" offset-md="3" offset-lg="3">
            <v-btn class="red ml-2" @click.prevent="showRemoveConditionDialog">Удалить условие</v-btn>
        </v-col>
        <accept-dialog
                :show-dialog="acceptDialog"
                :hide-dialog="hideAcceptDialog"
                :title="acceptTitle"
                :btn-text="acceptBtnText"
                :additional-text="additionalText"
                :on-success="acceptTitle=='Сброс условия'?resetCondition:removeConditionCallback"
        ></accept-dialog>
    </v-row>
</template>

<script>
    import ConditionOperator from "./ConditionOperator";
    import AcceptDialog from "../../../common/AcceptDialog";

    export default {
        components: {AcceptDialog, ConditionOperator},
        props: {
            excelHeaders: Array,
            initialConditions: Array,
            setCondition: Function,
            removeCondition: Function
        },
        mounted(){
            if(this.initialConditions.length > 0) {
                this.conditions = this.initialConditions;
            } else {
                this.firstExcelHeader = '';

                if(this.excelHeaders.length > 0){
                    this.firstExcelHeader = this.excelHeaders[0];
                }

                this.conditions.push([this.firstExcelHeader, '==', '']);
                this.setCondition(this.conditions);
            }
        },
        name: "AdditionalCondition",
        data: () => ({
            firstExcelHeader: '',
            conditions: [],
            logicalOperators: ['И', 'ИЛИ'],
            acceptDialog: false,
            acceptTitle: '',
            acceptBtnText: '',
            additionalText: ''
        }),
        methods: {
             setOperator(operatorIndex, operator){
                 this.conditions[operatorIndex] = operator;
                 this.setCondition(this.conditions);
             },
            setLogicalOperator(operator, operatorIndex){
                this.conditions[operatorIndex] = operator;
                this.setCondition(this.conditions);
            },
            addCondition(){
                this.conditions.push('И');
                this.conditions.push([this.firstExcelHeader, '==', '']);
                this.setCondition(this.conditions);
            },
            addQuotes(){
                this.conditions.unshift('(');
                this.conditions.push(')');
                this.setCondition(this.conditions);
            },
            addNo(){
                if(this.conditions[0] != '('){
                    this.conditions.unshift('(');
                    this.conditions.push(')');
                }

                this.conditions.unshift('НЕ');
                this.setCondition(this.conditions);
            },
            showResetConditionDialog(){
                 this.acceptTitle = 'Сброс условия';
                 this.acceptBtnText = 'Сбросить';
                 this.additionalText = 'сбросить условие';
                 this.acceptDialog = true;
            },
            resetCondition(){
                this.conditions = [];
                this.conditions.push([this.firstExcelHeader, '==', '']);
                this.setCondition(this.conditions);
            },
            showRemoveConditionDialog(){
                this.acceptTitle = 'Удаление условия';
                this.acceptBtnText = 'Удалить';
                this.additionalText = 'Удалить условие';
                this.acceptDialog = true;
            },
            removeConditionCallback(){
                 this.removeCondition();
            },
            hideAcceptDialog(){
                 this.acceptDialog = false;
            }
        }
    }
</script>

<style scoped>

</style>