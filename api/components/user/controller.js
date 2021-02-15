const auth = require('../auth');
const { nanoid } = require('nanoid');
const error = require('../../../utils/error');
const bcrypt = require('bcrypt');

const TABLA = 'user';

module.exports = function (injectedStore){
    let store = injectedStore;
    if(!store){
        store = require('../../../store/mysql');
    }

    function list(){
        return store.list(TABLA);
    }

    function get(id){
        return store.get(TABLA, id);
    }

    function getEmail(email){
        return store.getEmail(TABLA, email);
    }

    async function encrypt(data) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data, saltRounds);
        return hashedPassword;
    }

    async function insert(body){
        const exist = await store.getVerifyUsername(TABLA, body.username);
        const verifyEmail = await store.getVerifyEmail(TABLA, body.email);
            if(Object.entries(exist).length !== 0 ){
                throw error('Este username ya esta registrado.', 401);
                } 
                    if(Object.entries(verifyEmail).length !== 0){
                        throw error('Este email ya esta registrado', 401);
                }
                else {
                const user = {
                    username: body.username,
                    name: body.name,
                    lastname: body.lastname,
                    email: body.email,
                    birthdate: body.birthdate,
                    profileimage: body.profileimage,
                    enrolled_id: body.enrolled_id,
                }

                if(body.id){
                    user.id = body.id;
                } else {
                    user.id = nanoid();
                }
                
                if(body.password || body.username){
                    await auth.upsert({
                        id: user.id,
                        username: user.username,
                        password: body.password,
                    })
                
            return store.insert(TABLA, user);
        }
    }
}

    async function upsert(body){
        const findId = await store.get(TABLA, body.id);
            if (findId.id === body.id){
                return store.upsert(TABLA, body);
            }
    }

    async function remove(id){
        const verifyId = await store.getVerifyId(TABLA, id);
            if(Object.entries(verifyId).length === 0){
                throw error('Este id no existe.', 401);
            } else {
                return store.remove(TABLA, id);
            }
        
    }

    return {
        list,
        get,
        getEmail,
        insert,
        upsert,
        remove,
        encrypt,
    };

}

