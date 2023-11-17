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
}

module.exports = TarefaListService