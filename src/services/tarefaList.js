class TarefaListService{
    constructor (TarefaListModel){
        this.tarefa_list = TarefaListModel
    }

    async get (){
        const tarefa = await this.tarefa_list.findAll()
        return tarefa
    }

    async adicinarLista(ListaDTO){
        try{
            await this.tarefa_list.create(ListaDTO)
        }catch(error){
            console.log(error.message)
            throw error
        }
    }

    async buscarLista(id){
        try{
            const lista = await this.tarefa_list.findAll({
                where:{
                    id_usuario:id
                }
            })
            return lista
        }catch(error){
            console.log(error.mensage)
            throw error
        }
    }
}

module.exports = TarefaListService