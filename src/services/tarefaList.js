class TarefaListService{
    constructor (TarefaListModel){
        this.tarefa_list = TarefaListModel
    }

    async get (){
        const tarefa = await this.tarefa_list.findAll()
        return tarefa
    }

    async adicinarLista(ListaDTO, req){
        const userId = req.userId
        try{
            ListaDTO.id_usuario = userId
            await this.tarefa_list.create(ListaDTO)
        }catch(error){
            console.log(error.message)
            throw error
        }
    }

    async buscarLista(req){
        try{
            const userId = req.userId;
            const listas = await this.tarefa_list.findAll({
                where:{
                    id_usuario:userId
                }
            })
            return listas
        }catch(error){
            console.log(error.mensage)
            throw error
        }
    }

    async deletarLista(id_tarefa_list){
        const tarefaList = await this.tarefa_list.findByPk(id_tarefa_list)
        try{
            if (tarefaList) {
                await tarefa_list.destroy();
                res.status(200).json("Lista excluída com sucesso.");
            } else {
                res.status(404).json("Lista não encontrada.");
            }
        } catch (error) {
            res.status(500).json("Não foi possível excluir, tente novamente!");
        }
    }

    async atualizarTarefaList(id_tarefa_list, dadosAtualizados) {
        const tarefaList = await this.tarefa_list.findByPk(id_tarefa_list);
    
        if (!tarefaList) {
            throw new Error('Tarefa não encontrada');
        }
    
        await tarefa.update(dadosAtualizados);
    }
}

module.exports = TarefaListService