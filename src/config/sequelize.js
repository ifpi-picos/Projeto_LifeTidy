//Esse arquivo é responsável por criar um conexão ao banco de dados usando o sequelize

//Importações
const Sequelize = require ('sequelize')
const configDatabase = require ('./database')

//Criando uma nova instância da classe sequelize usando objeto configDatabase
const sequelize = new Sequelize (configDatabase)

//Exportando o módulo 
module.exports = sequelize