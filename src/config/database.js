//Arquivo de configuração onde ocorre a conexão ao banco de dados

module.exports = {
    dialect: 'postgres',
    host: 'isabelle.db.elephantsql.com',
    port: 5432,
    database: 'jxtijrmq',
    username: 'jxtijrmq',
    password: 'LYS95B61eKVylI4jNz0jt9jKaOGjARMX',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
}

// module.exports={
//     dialect: 'postgres',
//     host: 'localhost',
//     port: 5432,
//     database: 'lifetidy',
//     username: 'postgres',
//     password: '02020757'
// }