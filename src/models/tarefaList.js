//Modelo da dados da tabela tarefas
const tarefa_list = (sequelize, DataTypes) =>{
    const Tarefa_list = sequelize.define('Tarefa_list',{
        id_tarefa_list:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey:true,
        },

        id_usuario:{
            type: DataTypes.INTEGER,
            allowNull: false
        },

        nome_lista:{
            type: DataTypes.STRING,
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

    }, {
        createdAt: false,
        updatedAt: false,
        id:false,
        tableName: 'tarefa_list',
        foreignKey: false
    })

    Tarefa_list.associate = function(models) {
        Tarefa_list.belongsTo(models.Usuario, {
          foreignKey: 'id_usuario',
          as: 'usuario'
        });
        Tarefa_list.hasMany(models.Item, {
          foreignKey: 'id_tarefa_list',
          as: 'itens'
        });
      };
    
    return Tarefa_list
}

module.exports = tarefa_list