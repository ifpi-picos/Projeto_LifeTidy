/*Este arquivo é responsável por definir e exportar um modelo de usuário
Pode ser usado para interagir com a tabela 'usuario' no banco de dados por meio do Sequelize.*/
const usuario = (sequelize, DataTypes) => {
    const Usuario = sequelize.define('Usuario', {
        nome:{
            type: DataTypes.STRING,
            allowNull: false
        },

        email:{
            type: DataTypes.STRING,
            unique: true
        },

        senha:{
            type: DataTypes.STRING,
            allowNull: false
        },

        telefone:{
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'usuario'
    })

    return Usuario
}

module.exports = usuario