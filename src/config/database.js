//Arquivo de configuração onde ocorre a conexão ao banco de dados

module.exports = {
    dialect: 'postgres',
    host: 'db.ekiyatmaskijezlsbtwc.supabase.co',
    port: 5432,
    database: 'postgres',
    username: 'postgres',
    password: 'H3xwKrN5bmXwiAXj',
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