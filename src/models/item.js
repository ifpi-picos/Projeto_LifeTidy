//Modelo da dados da tabela tarefas
const item = (sequelize, DataTypes) =>{
    const Item = sequelize.define('Item',{
        id_item:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey:true,
        },

        id_tarefa:{
            type: DataTypes.INTEGER,
            allowNull: false
        },

        nome_item:{
            type: DataTypes.STRING,
        },

        quantidade:{
            type: DataTypes.STRING
        },

        medida:{
            type:DataTypes.FLOAT,
        },

        status:{
            type:DataTypes.STRING,
        },

    }, {
        createdAt: false,
        updatedAt: false,
        id:false,
        tableName: 'item',
        foreignKey: false
    })
    Item.associate = function(models) {
      Item.belongsTo(models.Tarefa_list, {
        foreignKey: 'id_tarefa_list',
        as: 'tarefa_list'
      });
    };
    return Item
}

module.exports = item