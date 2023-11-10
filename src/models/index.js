//Fornece uma forma estruturada de acessar e interagir com o banco de dados e os dados relacionados a usuários.

//Importações
const sequelize = require('../config/sequelize')
const Sequelize = require('sequelize')
const Usuario = require('./usuario')
const Tarefa = require('./tarefa')
const Item = require('./item')
const Tarefa_list = require('./tarefaList')

//Criando um modelos para realizar operações no banco de dados 
const usuario = Usuario(sequelize, Sequelize.DataTypes )
const tarefa = Tarefa(sequelize, Sequelize.DataTypes)
const item = Item (sequelize, Sequelize.DataTypes)
const tarefa_list = Tarefa_list(sequelize, Sequelize.DataTypes)
//Criando um objeto com duas propriedades para exportar e usar em outros módulos da plataforma 
const db = {
    usuario, 
    tarefa,
    sequelize,
    item,
    tarefa_list
}
//Exportando
module.exports = db