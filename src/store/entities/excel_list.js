import Routes from "@/constants/routes";
import {formRequest, postRequest, downloadGet} from "../../helpers/requests_to_server";

export default {
    state: {
        excelListsHeaders: [
            {
                text: '',
                align: 'center',
                sortable: false,
                value: 'id',
            },
            {
                text: 'Статус',
                align: 'center',
                sortable: false,
                value: 'status'
            },
            {
                text: 'Результат',
                align: 'center',
                sortable: false,
                value: 'zip_path'
            },
        ],
        excelLists: [],
        excelListsCount: 0,
        listsIdsForZipDownloading: []
    },
    actions: {
        async getExcelLists({commit}, params){
               let res = await postRequest(Routes.GET_LISTS_URL, params);
               commit('setExcelLists', res.data.data);
               commit('setExcelListsCount', res.data.recordsTotal);
        },
        // eslint-disable-next-line no-empty-pattern
        async getExcelHeaders({}, file){
                let formData = new FormData();
                formData.append('excel_list', file);
                let res = await formRequest(Routes.GET_EXCEL_HEADERS_URL, formData);
                return res.data.headers;
        },
        // eslint-disable-next-line no-empty-pattern
        async saveListToDataBase({}, formData){
            await formRequest(Routes.SAVE_EXCEL_URL, formData);
        },
        // eslint-disable-next-line no-empty-pattern
        async downloadZipResult({}, listId){
            await downloadGet(Routes.DOWNLOAD_ZIP_RESULT_URL + listId)
        },
        startZipDownloading({commit}, listId){
           commit('startZipDownloading', listId);
        },
        endZipDownloading({commit}, listId){
            commit('endZipDownloading', listId);
        }
    },
    mutations:{
        startZipDownloading(state, listId){
             state.listsIdsForZipDownloading.push(listId);
        },
        endZipDownloading(state, listId){
            let listIndex = state.listsIdsForZipDownloading.indexOf(listId);
            state.listsIdsForZipDownloading.splice(listIndex, 1);
        },
        setExcelLists(state, excelLists){
            state.excelLists = excelLists;
        },
        setExcelListsCount(state, listsCount){
            state.excelListsCount = listsCount;
        }
    },
    getters: {
        excelLists(state){
            return state.excelLists;
        },
        excelListsCount(state){
            return state.excelListsCount;
        },
        excelListsHeaders(state){
            return state.excelListsHeaders;
        },
        listsIdsForZipDownloading(state){
            return state.listsIdsForZipDownloading;
        }
    }
}