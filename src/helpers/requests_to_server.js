import Routes from "@/constants/routes.js"
import { ajaxDownload } from "@/helpers/common"
import router from "@/plugins/router.js"
import axios from "axios"

const decoder = new TextDecoder()

axios.interceptors.response.use(response => response, err => {
    let val = err?.response?.data
    if (val && typeof val !== 'string') {
        val = decoder.decode(val)
    }
    try {
        val = JSON.parse(val || null)?.message
    } catch (ignored) {
        console.warn("объект ошибки не json", val)
    }
    alert(val || err)
    return Promise.reject(err)
});

export async function downloadGet(url) {
    let store = require("@/store/");

    try {
        if (store.default.getters.token) {
            axios.defaults.headers.common = {
                Accept: 'application/json',
                Authorization: 'Bearer ' + store.default.getters.token
            };
        }

        const res = await await axios.get(url, {
            responseType: "arraybuffer"
        });

        if(res.status == '401' || (res.data.status && res.data.status =='401')){
            throw "err";
        }

        ajaxDownload(res);
    } catch(error) {
        if (error.response.status === 401 || error.response.status === 403) {
            store.default.dispatch("cleanToken");
            router.push("/login");
        } else {
            return error;
        }
    }
}

export async function downloadPost(url, data) {
    let store = require("@/store/");

    try {
        if (store.default.getters.token) {
            axios.defaults.headers.common = {
                Accept: 'application/json',
                Authorization: 'Bearer ' + store.default.getters.token
            };
        }

        const res = await await axios.post(url, data, {
            responseType: "arraybuffer"
        });

        if(res.status == '401' || (res.data.status && res.data.status =='401')){
            throw "err";
        }

        ajaxDownload(res);
    } catch(error) {
        if (error.response.status === 401 || error.response.status === 403) {
            store.default.dispatch("cleanToken");
            router.push("/login");
        } else {
            return error;
        }
    }
}

export function check(to, from, next) {
    authCheck(to, from, next);
}

export async function authCheck(to, from, next) {
    let store = require("@/store/");

    try {
        axios.defaults.headers.common = {
            Accept: 'application/json',
            Authorization:  'Bearer ' + store.default.getters.token
        };

        if (!store.default.getters.token) {
            axios.defaults.headers.common = {
                Accept: 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('excel_token')
            };
        }

        let result = await axios.get(Routes.AUTH_CHECK_ROUTE);

        if (result.status == '401' || result.status == '403' || (result.data.status && result.data.status == '401')) {
            throw "err";
        }

        if (to.name == 'login') {
            router.push("/");
        } else {
            next();
        }
    } catch (error) {
        if (to.name != 'login') {
            store.default.dispatch("cleanToken");
            router.push("/login");
        } else {
            next();
        }
    }

}

export async function postRequest(requestUrl, requestData) {
    let store = require("@/store/");

    try {
        if (store.default.getters.token) {
            axios.defaults.headers.common = {
                Accept: 'application/json',
                Authorization: 'Bearer ' + store.default.getters.token
            };
        }

        let result = await axios.post(requestUrl, requestData);

        if(result.status == '401' || (result.data.status && result.data.status =='401')){
            throw "err";
        }

        return result;
    } catch(error) {
        if (error.response.status === 401 || error.response.status === 403) {
            store.default.dispatch("cleanToken");
            router.push("/login");
        } else {
            return error;
        }
    }
}

export async function formRequest(requestUrl, requestData) {
    let store = require("@/store/");

    try {
        if (store.default.getters.token) {
            axios.defaults.headers.common = {
                Accept: 'application/json',
                Authorization: 'Bearer ' + store.default.getters.token
            };
        }

        let result = await axios.post(requestUrl, requestData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if(result.status == '401' || (result.data.status && result.data.status =='401')){
            throw "err";
        }

        return result;
    } catch(error) {
        if (error.response.status === 401 || error.response.status === 403) {
            store.default.dispatch("cleanToken");
            router.push("/login");
        } else {
            return error;
        }
    }
}

export async function getRequest(requestUrl) {
    let store = require("@/store/");

    try {
        if (store.default.getters.token) {
            axios.defaults.headers.common = {
                Accept: 'application/json',
                Authorization: 'Bearer ' + store.default.getters.token
            };
        }

        let result = await axios.get(requestUrl);

        if(result.status == '401' || (result.data.status && result.data.status =='401')){
            throw "err";
        }

        return result
    } catch(error) {
        if (error.response.status === 401 || error.response.status === 403) {
            store.default.dispatch("cleanToken");
            router.push("/login");
        } else {
            return error;
        }
    }
}

export async function getImage(fileUrl) {
    let store = require("@/store/");

    try {
        axios.defaults.headers.common = {
            Accept: store.default.getters.loginHeaders.Accept,
            Authorization: store.default.getters.loginHeaders.Authorization
        };

        let result = await axios.get(fileUrl, {
            responseType: "arraybuffer",
        });

        if (result.status == '401' || (result.data.status && result.data.status == '401')) {
            throw "err";
        }

        return result.data;
    } catch (error) {
        if (error.response.status === 401 || error.response.status === 403) {
            try {
                store.default.dispatch('loginWithRefreshToken');

                axios.defaults.headers.common = {
                    Accept: store.default.getters.loginHeaders.Accept,
                    Authorization: store.default.getters.loginHeaders.Authorization
                };

                let result = await axios.get(fileUrl, {
                    responseType: "arraybuffer",
                });

                if (result.status == '401' || (result.data.status && result.data.status == '401')) {
                    throw "err";
                }

                return result.data;
            } catch (err) {
                router.push("/login");
                return false;
            }
        } else {
            return error;
        }
    }
}
