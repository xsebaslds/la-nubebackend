const { json } = require('express');
const mysql = require('mysql');
const config = require('../config');

// Datos de conexión.
const dbconf = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
};

// Connect!
let connection;
function handleCon(){
    connection = mysql.createConnection(dbconf);

    connection.connect((err) => {
        if(err){
            console.error('[db err]', err);
            setTimeout(handleCon, 2000);
        } else {
            console.log('DB Connected!');
        }
    });
    connection.on('error', err => {
        console.error('[db err]', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST'){
            handleCon();
        } else {
            throw err;
        }
    })
}
handleCon();

function list(table){
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${table}`, (err, data) => {
            if(err) return reject(err);
            resolve(data);
        })
    })
}

function get(table, id){
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${table} WHERE id='${id}'`, (err, data) => {
            if(err) return reject(err);
            resolve(data);
        })
    })
}

function insert(table, data){
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO ${table} SET ?`, data, (err, result) => {
            if(err) return reject(err);
            resolve(result);
        })
    })
}

function update(table, data){
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE ${table} SET ? WHERE id=?`, [data, data.id], (err, result) => {
            if(err) return reject(err);
            resolve(result);
        })
    })
}

function upsert(table, data, isNew){
    if (data && isNew){
        return insert(table, data);
    } else {
        return update(table, data);
    }
}

function query(table, query){
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${table} WHERE ?`, query, (err, res) => {
            if (err) return reject(err);
            resolve(res[0] || null);
        })
    })
}


function remove(table, id){
    return new Promise((resolve, reject) => {

        connection.query(`DELETE FROM ${table} WHERE id= '${id}'`, (err, data) =>{
            if(err) return reject(err);
            resolve(data);
        })
    })
}

// FUNCIONES PERSONALIZADAS
function getVerifyId(table, id){
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${table} WHERE id= '${id}'`, (err, data) => {
            if(err) return reject(err);
            resolve(data);
        })
    })
}

function getVerifyUsername(table, username){
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${table} WHERE username= '${username}'`, (err, data) => {
            if(err) return reject(err);
            resolve(data);
        })
    })
}

function getVerifyEmail(table, email){
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${table} WHERE email= '${email}'`, (err, result) => {
            if(err) return reject(err);
            resolve(result);
        })
    })
}

module.exports = {
    list,
    get,
    insert,
    upsert,
    update,
    query,
    remove,
    getVerifyId,
    getVerifyUsername,
    getVerifyEmail,
}