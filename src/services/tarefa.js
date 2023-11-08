class TarefaService{
    constructor (TarefaModel){
        this.tarefa = TarefaModel
    }

    async get(){
        const tarefa = await this.tarefa.findAll()
        return tarefa 
    }

    async adicionarTaref(tarefaDTO){
        try {
            await this.tarefa.create(tarefaDTO)
        } catch (erro){
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
}

module.exports = TarefaService