
export default {
    state: {
        templatePropertyTypes: [
            {
                id: 1,
                name: 'Столбец'
            },
            {
                id: 2,
                name: 'Таблица'
            },
            {
                id: 3,
                name: 'Текст'
            }
        ]
    },
    actions: {
    },
    mutations:{
    },
    getters: {
        templatePropertyTypes(state){
            return state.templatePropertyTypes;
        }
    }
}