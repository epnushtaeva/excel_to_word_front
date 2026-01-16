export function getNextId(arr){
    if(arr.length == 0){
        return 1;
    }

    return Math.max(...arr.map(a => a.id)) + 1;
}

export function conditionToString(condition) {
    if(!condition){
        return '';
    }

    let conditionString = '';

    condition.forEach(conditionItem => {
        if(Array.isArray(conditionItem)){
            conditionString += '{' + conditionItem[0] +'}' + conditionItem[1] + "'" + conditionItem[2] + "'";
        } else {
             switch(conditionItem){
                 case 'И':
                     conditionString += '&&';
                     break;
                 case 'ИЛИ':
                     conditionString += '||';
                     break;
                 case 'НЕ':
                     conditionString += '!';
                     break;
                 default:
                     conditionString += conditionItem;
                     break;
             }
        }

        conditionString += ' ';
    });

    return conditionString.trim();
}