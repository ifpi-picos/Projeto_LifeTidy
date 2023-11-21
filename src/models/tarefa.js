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
                if (value != null && value != ''){
                    const dataFormatada = value.toLocaleDateString('pt-BR')
                    if (dataFormatada == '01/01/1000') {
                        return '00/00/0000';
                    }
                    return dataFormatada
                }

                if (value == '01/01/1000' || value === '' || value === null || value === undefined) {
                    return '00/00/0000';
                }
            },
        },

        data_fim:{
            type: DataTypes.DATE,
            get() {
                const value = this.getDataValue('data_fim');
                if (value != null && value != ''){
                    const dataFormatada = value.toLocaleDateString('pt-BR')
                    if (dataFormatada == '01/01/1000') {
                        return '00/00/0000';
                    }
                    return dataFormatada
                }

                if (value == '01/01/1000' || value === '' || value === null || value === undefined) {
                    return '00/00/0000';
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