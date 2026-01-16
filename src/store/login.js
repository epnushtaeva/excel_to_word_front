import Routes from "@/constants/routes";
import {postRequest} from "../helpers/requests_to_server";

export default {
    state: {
        token: ''
    },
    actions: {
        async getToken({commit}, {login, password}){
            let res = await postRequest(Routes.LOGIN_URL, {login, password});

            if(res.data.token){
                commit('setToken', res.data.token);
            }

            localStorage.setItem('excel_token', res.data.token);

            return res.data.token;
        },
        initTokenFromLocalStorage({commit}){
            commit('setToken', localStorage.getItem('excel_token'));
        },
        cleanToken({commit}){
            commit('setToken', '');
        }
    },
    mutations:{
        setToken(state, token){
            state.token = token;
        }
    },
    getters: {
        token(state){
            return state.token;
        }
    }
}