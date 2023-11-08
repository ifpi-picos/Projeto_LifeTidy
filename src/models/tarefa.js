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

        nome:{
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
                const formato = this.getDataValue('data_inicio');
                // Formate a data para o formato desejado (por exemplo, dia/mês/ano)
                const dataFormatada = formato.toLocaleDateString('pt-BR');
                return dataFormatada;
            },
        },

        data_fim:{
            type: DataTypes.DATE,
            get() {
                const formato = this.getDataValue('data_fim');
                // Formate a data para o formato desejado (por exemplo, dia/mês/ano)
                const dataFormatada = formato.toLocaleDateString('pt-BR');
                return dataFormatada;
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