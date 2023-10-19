const usuario = (sequelize, DataTypes) => {
    const Usuario = sequelize.define('Usuario', {
        nome:{
            type: DataTypes.STRING
        },

        email:{
            type: DataTypes.STRING
        },

        senha:{
            type: DataTypes.STRING
        },

        telefone:{
            type: DataTypes.STRING
        }
    }, {
        tableName: 'usuario'
    })

    return Usuario
}

module.exports = usuario