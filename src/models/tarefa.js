//Modelo da dados da tabela tarefas
const tarefa = (sequelize, DataTypes) =>{
    const Tarefa = sequelize.define('Tarefa',{
        id_tarefa:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey:true,
        },

        id_usuario:{
            type: DataTypes.INTEGER,
            allowNull: false
        },

        nome_tarefa:{
            type: DataTypes.STRING,
        },

        descricao:{
            type: DataTypes.STRING,
        },

        categoria:{
            type: DataTypes.STRING
        },

        data_inicio:{
            type: DataTypes.DATE,
            get() {
                const value = this.getDataValue('data_inicio');
                if (value){
                    const dataFormatada = value.toISOString().split('T')[0]
                    return dataFormatada === '1000-01-01'? '00/00/0000' : dataFormatada.split('-').reverse().join('/')
                }
        },

        data_fim:{
            type: DataTypes.DATE,
            get() {
                const value = this.getDataValue('data_fim');
                if (value){
                    const dataFormatada = value.toISOString().split('T')[0]
                    return dataFormatada === '1000-01-01'? '00/00/0000' : dataFormatada.split('-').reverse().join('/')
                }
            },
        },

        hora_inicio:{
            type: DataTypes.TIME,
        },

        hora_fim:{
            type: DataTypes.TIME,
        },

        importancia:{
            type: DataTypes.STRING
        },

        status:{
            type:DataTypes.STRING,
        },

    }, {
        createdAt: false,
        updatedAt: false,
        id:false,
        tableName: 'tarefa',
        foreignKey: false
    })

    Tarefa.associate = function(models) {
        Tarefa.belongsTo(models.Usuario, {
          foreignKey: 'id_usuario',
          as: 'usuario'
        });
        Tarefa.hasMany(models.Item, {
          foreignKey: 'id_tarefa',
          as: 'itens'
        });
      };
    
    return Tarefa
}

module.exports = tarefa