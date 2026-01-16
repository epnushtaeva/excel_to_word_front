<template>
    <v-row>
        <v-col cols="4">
            <v-select      label="Столбец из excel"
                           outlined
                           v-model="excelHeader"
                           :items = "excelHeaders"></v-select>
        </v-col>
        <v-col cols="3">
            <v-select      label="Оператор"
                           outlined
                           v-model="operator"
                           :items = "operators"
                           :item-text="filterSource=>filterSource.text"
                           :item-value="filterSource=>filterSource.value"></v-select>
        </v-col>
        <v-col cols="4">
            <v-text-field  label="Значение"
                           clearable outlined
                           v-model="value"></v-text-field>
        </v-col>
    </v-row>
</template>

<script>
    export default {
        props: {
            excelHeaders: Array,
            operatorIndex: Number,
            setOperator: Function,
            initialValue: Array
        },
        name: "ConditionOperator",
        watch:{
            excelHeader: {
                handler(){
                    this.changeOperator();
                }
            },
            operator: {
                handler(){
                    this.changeOperator();
                }
            },
            value: {
                handler(){
                    this.changeOperator();
                }
            }
        },
        mounted(){
            if(this.excelHeaders.length > 0) {
                this.excelHeader = this.excelHeaders[0];
            }

            if(this.initialValue.length > 0) {
                this.initFromInitialValue();
            }

            this.changeOperator();
        },
        data: () => ({
               excelHeader: '',
               operator: '==',
               operators: [
                   {value: '==', text: '='},
                   {value: '>', text: '>'},
                   {value: '>=', text: '>='},
                   {value: '<', text: '<'},
                   {value: '<=', text: '<='},
                   {value: '!=', text: '!='}
               ],
               value:''
         }),
        methods: {
            changeOperator(){
                this.setOperator(this.operatorIndex, [this.excelHeader, this.operator, this.value]);
            },
            initFromInitialValue(){
              this.excelHeader = this.initialValue[0];
              this.operator = this.initialValue[1];
              this.value = this.initialValue[2];
            }
        }
    }
</script>

<style scoped>

</style>