<template>
    <v-dialog
            v-model="dialogModel"
            width="500"
    >
        <v-card v-if="dialogModel">
            <v-card-title class="text-h5 blue darken-1 white--text">
                {{title}}
            </v-card-title>
            <v-card-text>
                <v-col cols="12" md="12" class="red--text">
                    Вы уверены, что хотите {{additionalText}}?
                </v-col>
            </v-card-text>
            <v-card-actions>
                <v-btn
                        color="red darken-1 white--text"
                        large
                        @click="onSuccessCallback"
                >{{btnText}}
                </v-btn>
                <v-btn
                        color="grey darken-1 white--text"
                        large
                        @click="dialogModel = false"
                >
                    Отмена
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        props: {
            additionalText: String,
            showDialog: Boolean,
            onSuccess: Function,
            hideDialog: Function,
            title: String,
            btnText: String
        },
        watch: {
            showDialog: {
                handler(){
                    if(this.showDialog){
                        this.dialogModel = true;
                    }
                }
            },
            dialogModel: {
                handler(){
                    if(!this.dialogModel){
                        this.hideDialog();
                    }
                }
            }
        },
        name: "AcceptDialog",
        data: () => ({
            dialogModel: false
        }),
        methods: {
            onSuccessCallback(){
                this.onSuccess();
                this.dialogModel = false;
            }
        }
    }
</script>

<style scoped>

</style>