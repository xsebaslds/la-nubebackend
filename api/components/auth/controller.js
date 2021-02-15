
const bcrypt = require('bcrypt');
const auth = require('../../../auth');
const TABLA = 'auth';

module.exports = function (injectedStore){
    let store = injectedStore;
    if(!store){
        store = require('../../../store/mysql');    
    }

    async function login(username, password){
        const data = await store.query(TABLA, { username: username});
            return bcrypt.compare(password, data.password)
                .then(function(result){
                if(result){
                    // generar token;  
                    return auth.sign(JSON.stringify(data));
                } else {
                    throw new Error('Informacion invalida controller');
                }  
            });
    }

    async function upsert(data){
        const authData = {
            id: data.id,
        }

        if(data.username){
            authData.username = data.username;
        }
        
        if(data.password){
            authData.password = await bcrypt.hash(data.password, 5);
        }

        return store.insert(TABLA, authData);
    }

    return {
        upsert,
        login,
    };

}