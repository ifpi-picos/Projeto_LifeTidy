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
            const userId = req.userId
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
        const tarefa = await this.tarefa.findByPk(id_tarefa)
    
        if (!tarefa) {
            throw new Error('Tarefa não encontrada');
        }
    
        await tarefa.update(dadosAtualizados);
    }

    async deletar(req, id) {
        try {
            const userId = req.userId
            const tarefa = await this.tarefa.findOne({
                where: {
                    id_usuario: userId,
                    id_tarefa: id
                }
            })
            if (tarefa) {
                await tarefa.destroy()
                return
            } else {
                throw new Error("Tarefa não encontrada.");
            }
        } catch (error) {
            throw new Error("Não foi possível excluir, tente novamente!");
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
    
            let urgente = 0
            let regular = 0
            let baixa = 0
    
            tarefas.forEach(tarefa => {
                if(tarefa.importancia === 'URGENTE') {
                    urgente = tarefa.dataValues.count
                } else if(tarefa.importancia === 'REGULAR') {
                    regular = tarefa.dataValues.count
                } else if(tarefa.importancia === 'BAIXA') {
                    baixa = tarefa.dataValues.count
                }
            })
    
            return { urgente, regular, baixa }
        }catch(error){
            throw new Error('Não foi possivel realizar essa ação, tente novamente!' + error)
        }
    }

    async tarefaConcluida( req, id_tarefa ){
        try{
            const userId = req.userId
            const tarefa = await this.tarefa.findOne({
                where: {
                    id_usuario: userId,
                    id_tarefa: id_tarefa
                }
            })
            tarefa.status = 'concluida'
            await tarefa.save()
            return
        }catch(error){
            throw new Error('Erro ao tentar atualizar o status: ' + error)
        }
    }

    async buscarUrgente(req){
        try{
            const userId = req.userId
            const tarefa = await this.tarefa.findAll({
                where: {
                    id_usuario: userId,
                    importancia: 'URGENTE'
                }
            })
            return tarefa
        }catch(error){
            throw new Error('Erro ao tentar buscar tarefas de importância: Urgentes: ' + error)
        }
    }
    async buscarRegular(req){
        try{
            const userId = req.userId
            const tarefa = await this.tarefa.findAll({
                where: {
                    id_usuario: userId,
                    importancia: 'REGULAR'
                }
            })
            return tarefa
        }catch(error){
            throw new Error('Erro ao tentar buscar tarefas de importância: Regulares: ' + error)
        }
    }
    async buscarBaixa(req){
        try{
            const userId = req.userId
            const tarefa = await this.tarefa.findAll({
                where: {
                    id_usuario: userId,
                    importancia: 'BAIXA'
                }
            })
            return tarefa
        }catch(error){
            throw new Error('Erro ao tentar buscar tarefas de importância: Baixa: ' + error)
        }
    }
}

module.exports = TarefaService