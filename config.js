module.exports = {
    api: {
        port: process.env.API_PORT || 3003,
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'notasecret!',
    },
    mysql: {
        host: process.env.MYSQL_HOST || 'mysql.db4free.net',
        user: process.env.MYSQL_USER || 'lanubecursos',
        password: process.env.MYSQL_PASS || 'l4nub3c0urs3s',
        database: process.env.MYSQL_DB || 'lanubecursos',
    }
}