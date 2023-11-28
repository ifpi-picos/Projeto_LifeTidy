const express = require('express')
const { tarefa } = require('../models')
const TarefaService = require('../services/tarefa')
const verificarToken = require('../middleware/autenticacao')
const router = express.Router()

const tarefaService = new TarefaService(tarefa)

router.get('/mostrarTarefas', async (req, res) => {
    const tarefa = await tarefaService.get()
    res.status(200).json(tarefa)
})

router.post('/adicionar', verificarToken, async (req, res) => {
    const {nome_tarefa, descricao, categoria, data_inicio, data_fim, hora_inicio, hora_fim, importancia, status} = req.body
    try{
        await tarefaService.adicionarTaref({nome_tarefa, descricao, categoria, data_inicio, data_fim, hora_inicio, hora_fim, importancia, status}, req) 
        res.status(201).send('Tarefa adicionada com sucesso')
    } catch (erro){
        res.status(400).send(erro.message)
    }
    
})

router.delete('/apagar', async (req, res) => {
    const {id} = req.body
    try {
        await tarefaService.deletar(req, id)
        res.status(200).json("Tarefa excluída com sucesso!")
    } catch (error) {
        res.status(400).json("Não foi possível excluir essa tarefa!")
    }
});

router.get('/buscarTarefas', async(req, res ) =>{

    try{
        const tarefas = await tarefaService.buscarTarefa(req,res)
        res.status(200).json(tarefas)
    }catch(erro){
        res.status(400).json('Erro ao buscar tarefas' + erro.message)
    }
})

router.put('/atualizar', async (req, res) => {
    try {
        const { id_tarefa, dadosAtualizados } = req.body;
        await tarefaService.atualizarTarefa(id_tarefa, dadosAtualizados);
        res.status(200).json('Tarefa atualizada com sucesso');
    } catch (erro) {
        res.status(400).json('Erro ao atualizar tarefa');
    }
});

router.get('/desempenho', async (req, res)=>{
    try{
        const {urgente, regular, baixa} = await tarefaService.desempenho(req, res)
        res.status(200).json({
            urgente: `O número de tarefas categoria urgente completadas foram: ${urgente}`,
            regular: `O número de tarefas categoria regular completadas foram: ${regular}`,
            baixa: `O número de tarefas categoria baixa completadas foram: ${baixa}`
        });
    }catch(error){
        res.status(400).json(error)
    }
})

router.put('/atualizarStatus', async(req, res)=>{
    try{
        const {id_tarefa} = req.body
        await tarefaService.tarefaConcluida(req, id_tarefa)
        res.status(200).json('Tarefa concluída');
    }catch(erro){
        res.status(400).json('Não foi possivel concluir a tarefa: ' + erro)
    } 
})



module.exports = router