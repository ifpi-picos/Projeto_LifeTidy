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
                if (tarefaDTO[prop] === undefined) {
                    if (prop === 'data_inicio' || prop === 'data_fim') {
                        tarefaDTO[prop] = '0000/00/00';
                    } else if (prop === 'hora_inicio' || prop === 'hora_fim') {
                        tarefaDTO[prop] = '00:00';
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

    async mudarNome(id_tarefa, novoNome){
        const tarefa = await this.tarefa.findByPk(id_tarefa) 
        tarefa.nome = novoNome
        await tarefa.save()
        return tarefa
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

}

module.exports = TarefaService