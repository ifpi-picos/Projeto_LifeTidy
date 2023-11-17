/*Este arquivo é responsável por definir e exportar um modelo de usuário
Pode ser usado para interagir com a tabela 'usuario' no banco de dados por meio do Sequelize.*/
const usuario = (sequelize, DataTypes) => {
    const Usuario = sequelize.define('Usuario', {
        id_usuario:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nome_usuario:{
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
        },
        token_reset:{
            type: DataTypes.STRING
        },
        token_reset_validade:{
            type:DataTypes.DATE
        }

    }, {
        createdAt: false,
        updatedAt: false,
        id:false,
        tableName: 'usuario',
        foreignKey: false
    })

    Usuario.associate = function(models) {
        Usuario.hasMany(models.Tarefa, {
          foreignKey: 'id_usuario',
          as: 'tarefa'
        })
      }
    Usuario.associate = function(models) {
        Usuario.hasMany(models.Tarefa, {
          foreignKey: 'id_usuario',
          as: 'tarefa_list'
        })
      }
    return Usuario
}

module.exports = usuario