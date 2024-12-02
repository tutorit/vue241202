
const okPromise=data => new Promise(resolve => setTimeout(resolve(data),100));
const failPromise=(message,status=404) => new Promise((x,reject) => setTimeout(reject({message,status},100))); 
const checkRequired=(obj,required) => required.every(r => obj[r]);

function validateFk(obj,foreignKeys,model){
    for(fki in foreignKeys){
        let {field,references}=foreignKeys[fki];
        let foreignId=obj[field];
        if (!foreignId) continue;
        if (!model[references].data.find(i => i.id==foreignId)) return false;
    }
    return true;
}

function hasReferences(table,id,model){
    for(let oi in model.order){
        let entityName=model.order[oi];
        if (entityName==table) continue;
        if (!model[entityName].foreignKeys) continue;
        for(let fki in model[entityName].foreignKeys){
            let fk=model[entityName].foreignKeys[fki];
            if (fk.references!=table) continue;
            if (model[entityName].data.find(i => i[fk.field]==id)) return entityName;
        }
    }
    return false;
}


function memoryDao(entity,model){
    const {data,required,table,foreignKeys=[]}=entity;

    return {
        getAll: (field,value) => {
            if (field) return okPromise(data.filter(i => i[field]==value));
            return okPromise(data);
        },
        get(id){
            let item=data.find(b => b.id==id);
            if (!item) return failPromise("Not found");
            return okPromise(item);
        },
        create(item){
            if (required && !checkRequired(item,required)) return failPromise("Required fields are missing",400);
            if (!validateFk(item,foreignKeys,model)) return failPromise("Foreign key check",400); 
            let maxId=data.reduce((a,b) => a.id>b.id ? a : b, {id:0}).id;
            item.id=maxId+1;
            data.push(item);
            return okPromise(item);
        },
        update(item){
            if (required && !checkRequired(item,required)) return failPromise("Required fields are missing",400);
            if (!validateFk(item,foreignKeys,model)) return failPromise("Foreign key check",400); 
            let i=data.find(i => i.id==item.id);
            if (!i) return failPromise("Not found");
            Object.assign(i,item);
            return okPromise(i);
        },
        delete(id){
            let index=data.findIndex(i => i.id==id);
            if (index<0) return failPromise("Not found");
            let ref=hasReferences(table,id,model);
            if (ref) return failPromise("Foreign key check: "+ref,400);
            data.splice(index,1);
            return okPromise({status:200,message:"Deleted"});
        }
        
    }
}

module.exports={memoryDao};