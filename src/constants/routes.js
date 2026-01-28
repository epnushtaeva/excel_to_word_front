export default Object.freeze({
    //load-list
    GET_EXCEL_HEADERS_URL: '/api/list/headers',
    SAVE_EXCEL_URL: '/api/list/save',

    //login
    LOGIN_URL: '/api/login',
    AUTH_CHECK_ROUTE: '/api/auth_check',

    //excel_lists
    GET_LISTS_URL: '/api/list/get',
    DOWNLOAD_ZIP_RESULT_URL: '/api/lists/download_result?list_id=',

    //websocket
    GET_WESOCKET_CONNECT_TOKEN_URL: '/api/centrifugo/connect_token',
    GET_WESOCKET_SUBSCRIBE_TOKEN_URL: '/api/centrifugo/channel_connect_info'
})