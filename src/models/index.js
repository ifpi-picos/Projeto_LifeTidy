


//Fornece uma forma estruturada de acessar e interagir com o banco de dados e os dados relacionados a usuários.

//Importações
const sequelize = require('../config/sequelize')
const Sequelize = require('sequelize')
const Usuario = require('./usuario')

//Criando um modelo de usuario para realizar operações relacionadas a usuarios no banco de dados 
const usuario = Usuario(sequelize, Sequelize.DataTypes )

//Criando um objeto com duas propriedades para exportar e usar em outros módulos da plataforma 
const db = {
    usuario, 
    sequelize
}
//Exportando
module.exports = db