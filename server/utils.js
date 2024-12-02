const camelToSnakeCase = str => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
const snakeToCamelCase = str =>str.toLowerCase().replace(/([-_][a-z])/g, group => group.toUpperCase().replace('-', '').replace('_', ''));

function withSnakeCaseProperties(obj){
    let ret={};
    for(let key in obj){
        ret[camelToSnakeCase(key)]=obj[key];
    }
    return ret;
}

function withCamelCaseProperties(obj){
    let ret={};
    for(let key in obj){
        ret[snakeToCamelCase(key)]=obj[key];
    }
    return ret;
}


module.exports={camelToSnakeCase,snakeToCamelCase,withSnakeCaseProperties,withCamelCaseProperties};