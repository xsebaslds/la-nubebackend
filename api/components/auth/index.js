const Controller = require('./controller');
const Store = require('../../../store/mysql');

module.exports = Controller(Store);

// Le inyectamos la base de datos al controlador.