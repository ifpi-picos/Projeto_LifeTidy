/*Este arquivo é responsável por definir e exportar um modelo de usuário
Pode ser usado para interagir com a tabela 'usuario' no banco de dados por meio do Sequelize.*/
const usuario = (sequelize, DataTypes) => {
    const Usuario = sequelize.define('Usuario', {
        id_usuario:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
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
        createdAt: false,
        updatedAt: false,
        id:false,
        tableName: 'usuario',
        foreignKey: false
    })

    Usuario.associate = function(models) {
        Usuario.hasMany(models.Tarefa, {
          foreignKey: 'id_usuario',
          as: 'tarefas'
        })
      }
    return Usuario
}

module.exports = usuario