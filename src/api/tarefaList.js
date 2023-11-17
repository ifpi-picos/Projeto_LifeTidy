const express = require('express')
const router = express.Router()
const { tarefa_list }= require('../models')
const TarefaListService = require('../services/tarefaList')
const verificarToken = require("../middleware/autenticacao")

const tarefaListService = new TarefaListService(tarefa_list)

router.post('/adicionarLista', async (req, res) =>{
    const {nome_lista, data_inicio, data_fim, hora_inicio, hora_fim} = req.body
    try{
        await tarefaListService.adicinarLista({nome_lista, data_inicio, data_fim, hora_inicio, hora_fim}, req)
        res.status(200).json('Lista adicionada com sucesso')
    }catch(erro){
        res.status(400).json('Erro ao adicionar lista')
    }
})

router.get('/buscarListas', async(req, res ) =>{
    try{
        const listas = await tarefaListService.buscarLista(req,res)
        res.status(200).json(listas)
    }catch(erro){
        res.status(400).json('Erro ao buscar tarefas')
    }
})

module.exports = router