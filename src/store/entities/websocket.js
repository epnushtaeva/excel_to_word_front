import Routes from "@/constants/routes";
import {getRequest} from "../../helpers/requests_to_server";

export default {
    state: {
        webSocketConnectAuth: '',
        webSocketSubsrcibeAuth: ''
    },
    actions: {
        async initWebsocketConnectAuth({commit}){
            let res = await getRequest(Routes.GET_WESOCKET_CONNECT_TOKEN_URL);
            commit('setWebSocketConnectAuth', 'Bearer ' + res.data.token);
            return res.data.user_id;
        },
        async initWebsocketSubscribeAuth({commit}){
            let res = await getRequest(Routes.GET_WESOCKET_SUBSCRIBE_TOKEN_URL);
            commit('setWebSocketSubsrcibeAuth', res.data.token);
        }
    },
    mutations:{
        setWebSocketSubsrcibeAuth(state, auth){
           state.webSocketSubsrcibeAuth = auth;
        },
        setWebSocketConnectAuth(state, auth){
            state.webSocketConnectAuth= auth;
        }
    },
    getters: {
        webSocketConnectAuth(state){
            return state.webSocketConnectAuth;
        },
        webSocketSubsrcibeAuth(state){
            return state.webSocketSubsrcibeAuth;
        }
    }
}