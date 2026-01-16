<template>
    <v-row>
        <login-form></login-form>
    </v-row>
</template>

<script>
    import LoginForm from "../login/LoginForm";
    export default {
        name: "LoginPage",
        components: {LoginForm}
    }
</script>

<style>
    body{
        background: #B0BEC5;
    }
</style>