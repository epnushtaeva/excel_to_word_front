<template>
    <v-app-bar
            color="blue darken-1"
            dark
            absolute elevate-on-scroll
    >
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
        <span class="title">ExcelToWord Online</span>

        <v-spacer></v-spacer>
        <v-btn text class="white--text title" href="/">ЗАГРУЖЕННЫЕ СПИСКИ</v-btn>
        <v-btn text class="white--text title" href="/load_excel">ЗАГРУЗКА EXCEL</v-btn>
        <v-spacer></v-spacer>
        <v-alert
                v-model="alert"
                type="success"
                position="fixed"
                location="top right"
                class="ma-4"
                elevation="4"
                style="z-index: 1000;"
                dismissible
                closable
        >
            Один из загруженных вами списков был обработан. На странице "ЗАГРУЖЕННЫЕ СПИСКИ" вы можете скачать архив со сгенерированными файлами word.
        </v-alert>
    </v-app-bar>
</template>

<script>
    import { Centrifuge } from 'centrifuge';
    import {mapGetters, mapActions} from "vuex";

    export default {
        name: "Header",
        mounted(){
            this.initClient();
        },
        computed: {
          ...mapGetters(['webSocketConnectAuth', 'webSocketSubsrcibeAuth'])
        },
        data: () => ({
            webSocket: null,
            alert: false,
            timeoutId: null
        }),
        methods: {
            ...mapActions(['initWebsocketConnectAuth', 'initWebsocketSubscribeAuth', 'updateListStatus']),
            async initClient(){
                let userId = await this.initAuth();
                this.initWebsocketConnection();
                this.subscribeOnMessages(userId);
                this.webSocket.connect();
            },
            async initAuth(){
                let userId = await this.initWebsocketConnectAuth();
                await this.initWebsocketSubscribeAuth();

                return userId;
            },
            initWebsocketConnection(){
                let centrifugoUrl = process.env.VUE_APP_CENTRIFUGO_URL;
                let self = this;
                this.webSocket =  new Centrifuge('ws://' + centrifugoUrl + '/connection/websocket', {
                    token: self.webSocketConnectAuth.replace('Bearer ', '')
                });
            },
            subscribeOnMessages(userId){
                let self = this;
                const sub = this.webSocket.newSubscription('messages' + userId.toString(), {
                    user: "admin",
                    token: self.webSocketSubsrcibeAuth
                });

                sub.on('publication', function(ctx) {
                    self.updateExcelList(ctx.data);
                    self.showAlert();
                });

                sub.subscribe();
            },
            updateExcelList(webSocketMessage){
                let exceListData = webSocketMessage.split(' ');
                let listId = parseInt(exceListData[0]);
                let status = exceListData[1];
                let zipPath = exceListData[2];
                this.updateListStatus({listId, status, zip_path:zipPath});
            },
            showAlert(){
                if (this.timeoutId) {
                    return;
                }

                let self = this;
                this.alert = true;
                this.timeoutId = setTimeout(() => {
                    self.alert = false;
                    self.timeoutId = null;
                }, 2000);
            }
        }
    }
</script>

<style scoped>

</style>