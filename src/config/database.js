//Arquivo de configuração onde ocorre a conexão ao banco de dados

module.exports = {
    dialect: 'postgres',
    host: 'motty.db.elephantsql.com',
    port: 5432,
    database: 'pbzpcsdc',
    username: 'pbzpcsdc',
    password: 'U8UY5YZN0M3qat0zBdCFyWHN-hFRaKZ2',
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