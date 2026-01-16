<template>
    <v-col md="3"  lg="3" sm="12"  offset-md="4" offset-lg="4" offset-sm="0" class="login-form mt-12 pl-2 pr-2 pt-0">
        <v-row class="pl-1 pr-1 pt-0">
            <v-col cols="12" class="primary mt-0 text-center">
                <h2 class="text--white primary">Вход</h2>
            </v-col>
            <v-col cols="12">
                <v-text-field  label="Логин"
                               clearable outlined class="mt-3"
                               v-model="login"
                ></v-text-field>
                <span class="red--text" v-if="!login">Пожалуйста, укажите логин</span>
            </v-col>
            <v-col cols="12">
                <v-text-field  label="Пароль"
                               clearable outlined type="password"
                               v-model="password"></v-text-field>
                <span class="red--text" v-if="!password">Пожалуйста, укажите пароль</span>
            </v-col>
            <v-col lg="5" md="5" sm="12" offset-md="5" offset-lg="5" offset-sm="0">
                <v-progress-circular
                        indeterminate
                        color="blue lighten-5"
                        v-if="loginRequestSending"
                ></v-progress-circular>
                <span class="red--text" v-if="!!loginError">{{loginError}}</span>
                <v-btn class="primary" :disabled="loginRequestSending || !login || !password" @click.prevent="sendLoginRequest">Войти</v-btn>
            </v-col>
        </v-row>
    </v-col>
</template>

<script>
    import {mapActions} from "vuex";
    import router from "@/plugins/router.js";

    export default {
        name: "LoginForm",
        data: () => ({
            login: '',
            password: '',
            loginRequestSending: false,
            loginError: ''
        }),
        methods:{
            ...mapActions(['getToken']),
            async sendLoginRequest(){
                let login = this.login;
                let password = this.password;
                this.loginRequestSending = true;
                this.loginError = '';
                let loginRes = await this.getToken({login, password});
                this.loginRequestSending = false;

                if(loginRes){
                    router.push('/load_excel');
                } else {
                    this.loginError = 'Неверный логин или пароль';
                }
            }
        }
    }
</script>

<style>
    .login-form{
        background: #ffffff !important;
        border-radius: 5px !important;
        max-height: 50vh !important;
    }

    .text--white{
        color: #ffffff !important;
    }
</style>