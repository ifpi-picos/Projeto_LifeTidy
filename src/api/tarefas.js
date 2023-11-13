const express = require('express')
const { tarefa } = require('../models')
const TarefaService = require('../services/tarefa')
const verificarToken = require('../middleware/autenticacao')
const router = express.Router()

const tarefaService = new TarefaService(tarefa)

router.get('/', async (req, res) => {
    const tarefa = await tarefaService.get()
    res.status(200).json(tarefa)
})

router.post('/adicionar', async (req, res) => {
    // delete req.body.id_tarefa;

    // const novaTarefa = await tarefa.create(req.body);
    const {id_usuario, nome_tarefa, descricao, categoria, data_inicio, data_fim, hora_inicio, hora_fim, importancia, status} = req.body
    try{
        await tarefaService.adicionarTaref({id_usuario, nome_tarefa, descricao, categoria, data_inicio, data_fim, hora_inicio, hora_fim, importancia, status}) 
        res.status(201).send('Tarefa adicionada com sucesso')
    } catch (erro){
        res.status(400).send(erro.message)
    }
    
})

// router.delete('/apagar', async (req, res) => {
//     const {id} = req.body
//     try {
//         await tarefaService.deletar(id, res)
//     } catch (error) {
//         res.status(400).json("Não foi possível excluir essa tarefa!")
//     }
// });

router.get('/buscarTarefas', verificarToken, async(req, res ) =>{

    try{
        const tarefas = await tarefaService.buscarTarefa(req,res)
        res.status(200).json(tarefas)
    }catch(erro){
        res.status(400).json('Erro ao buscar tarefas')
    }
})

router.put('/mudarNome', async (req, res) =>{
    try{
        const {id_tarefa, novoNome} = req.body 
        await tarefaService.mudarNome(id_tarefa, novoNome)
        res.status(200).json('Nome da tarefa alterado com sucesso')
    } catch(erro){
        res.status(400).json('Erro ao alterar nome de tarefa')
    }
})

module.exports = router