class TarefaService{
    constructor (TarefaModel){
        this.tarefa = TarefaModel
    }

    async get(){
        const tarefa = await this.tarefa.findAll()
        return tarefa 
    }

    async adicionarTaref(tarefaDTO, req){
        const userId = req.userId
        try {
            for (let prop in tarefaDTO) {
                if (tarefaDTO[prop] == '') {
                    if (prop === 'data_inicio' || prop === 'data_fim') {
                        console.log('Foi')
                        tarefaDTO[prop] = '1000/01/01'
                    } else if (prop === 'hora_inicio' || prop === 'hora_fim') {
                        tarefaDTO[prop] = '00:00:00';
                    } else {
                        tarefaDTO[prop] = '';
                    }
                }
            }
            tarefaDTO.id_usuario = userId
            await this.tarefa.create(tarefaDTO)
        } catch (erro){
            console.error(erro.message)
            throw erro
        }
    }

    async buscarTarefa(req){
        try{
            const userId = req.userId;
            const tarefas = await this.tarefa.findAll({
                where:{
                    id_usuario: userId
                }
            })
        return tarefas
        }catch(erro){
            console.error(erro.message)
            throw erro
        }
    }

    async atualizarTarefa(id_tarefa, dadosAtualizados) {
        const tarefa = await this.tarefa.findByPk(id_tarefa);
    
        if (!tarefa) {
            throw new Error('Tarefa não encontrada');
        }
    
        await tarefa.update(dadosAtualizados);
    }

    async deletar(id, res) {
        try {
            const tarefa = await this.tarefa.findOne({
                where: {
                    id: id
                }
            });
    
            if (tarefa) {
                await tarefa.destroy();
                res.status(200).json("Tarefa excluída com sucesso.");
            } else {
                res.status(404).json("Tarefa não encontrada.");
            }
        } catch (error) {
            res.status(500).json("Não foi possível excluir, tente novamente!");
        }
    }

    async desempenho(req){
        try{
            const userId = req.userId
            console.log(userId)
            if (!userId) {
                throw new Error('ID do usuário não fornecido');
            }
            const tarefas = await this.tarefa.findAll({
                where:{
                    id_usuario: userId
                },
                attributes: ['importancia', [DataTypes.fn('COUNT', DataTypes.col('importancia')), 'count']],
                group: ['importancia']
            })
    
            let urgente = 0;
            let regular = 0;
            let baixa = 0;
    
            tarefas.forEach(tarefa => {
                if(tarefa.importancia === 'urgencia') {
                    urgente = tarefa.dataValues.count;
                } else if(tarefa.importancia === 'regular') {
                    regular = tarefa.dataValues.count;
                } else if(tarefa.importancia === 'pouco-urgente') {
                    baixa = tarefa.dataValues.count;
                }
            });
    
            return { urgente, regular, baixa };
        }catch(error){
            throw new Error('Não foi possivel realizar essa ação, tente novamente!' + error)
        }
    }
}

module.exports = TarefaService