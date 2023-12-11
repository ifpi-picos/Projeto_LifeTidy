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

/**
 * @swagger
 * /adicionar:
 *   post:
 *     summary: Adiciona uma nova tarefa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome_tarefa:
 *                 type: string
 *               descricao:
 *                 type: string
 *               categoria:
 *                 type: string
 *               data_inicio:
 *                 type: string
 *               data_fim:
 *                 type: string
 *               hora_inicio:
 *                 type: string
 *               hora_fim:
 *                 type: string
 *               importancia:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tarefa adicionada com sucesso
 *       400:
 *         description: Erro ao adicionar tarefa
 */

router.post('/adicionar', verificarToken, async (req, res) => {
    const {nome_tarefa, descricao, categoria, data_inicio, data_fim, hora_inicio, hora_fim, importancia, status} = req.body
    try{
        await tarefaService.adicionarTaref({nome_tarefa, descricao, categoria, data_inicio, data_fim, hora_inicio, hora_fim, importancia, status}, req) 
        res.status(201).send('Tarefa adicionada com sucesso')
    } catch (erro){
        res.status(400).send(erro.message)
    }
    
})

/**
 * @swagger
 * /apagar:
 *   delete:
 *     summary: Apaga uma tarefa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tarefa excluída com sucesso
 *       400:
 *         description: Não foi possível excluir essa tarefa
 */

router.delete('/apagar', async (req, res) => {
    const {id} = req.body
    try {
        await tarefaService.deletar(req, id)
        res.status(200).json("Tarefa excluída com sucesso!")
    } catch (error) {
        res.status(400).json("Não foi possível excluir essa tarefa!")
    }
});

/**
 * @swagger
 * /buscarTarefas:
 *   get:
 *     summary: Busca todas as tarefas
 *     responses:
 *       200:
 *         description: Sucesso ao buscar tarefas
 *       400:
 *         description: Erro ao buscar tarefas
 */

router.get('/buscarTarefas', async(req, res ) =>{

    try{
        const tarefas = await tarefaService.buscarTarefa(req,res)
        res.status(200).json(tarefas)
    }catch(erro){
        res.status(400).json('Erro ao buscar tarefas' + erro.message)
    }
})

/**
 * @swagger
 * /atualizar:
 *   put:
 *     summary: Atualiza uma tarefa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_tarefa:
 *                 type: string
 *               dadosAtualizados:
 *                 type: object
 *     responses:
 *       200:
 *         description: Tarefa atualizada com sucesso
 *       400:
 *         description: Erro ao atualizar tarefa
 */

router.put('/atualizar', async (req, res) => {
    try {
        const { id_tarefa, dadosAtualizados } = req.body;
        await tarefaService.atualizarTarefa(id_tarefa, dadosAtualizados);
        res.status(200).json('Tarefa atualizada com sucesso');
    } catch (erro) {
        res.status(400).json('Erro ao atualizar tarefa');
    }
});

/**
 * @swagger
 * /desempenho:
 *   get:
 *     summary: Retorna o desempenho das tarefas
 *     responses:
 *       200:
 *         description: Sucesso ao buscar desempenho
 *       400:
 *         description: Erro ao buscar desempenho
 */

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

/**
 * @swagger
 * /atualizarStatus:
 *   put:
 *     summary: Atualiza o status de uma tarefa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_tarefa:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status da tarefa atualizado com sucesso
 *       400:
 *         description: Erro ao atualizar status da tarefa
 */

router.put('/atualizarStatus', async(req, res)=>{
    try{
        const {id_tarefa} = req.body
        await tarefaService.tarefaConcluida(req, id_tarefa)
        res.status(200).json('Tarefa concluída')
    }catch(erro){
        res.status(400).json('Não foi possivel concluir a tarefa: ' + erro)
    } 
})

/**
 * @swagger
 * /buscarUrgentes:
 *   get:
 *     summary: Busca todas as tarefas urgentes
 *     responses:
 *       200:
 *         description: Sucesso ao buscar tarefas urgentes
 *       400:
 *         description: Erro ao buscar tarefas urgentes
 */

router.get('/buscarUrgentes', async(req, res)=>{
    try{
        const tarefas = await tarefaService.buscarUrgente(req)
        res.status(200).json(tarefas)
    }catch(erro){
        res.status(400).json('Não foi possivel buscar tarefas: ' + erro)
    } 
})

/**
 * @swagger
 * /buscarRegulares:
 *   get:
 *     summary: Busca todas as tarefas regulares
 *     responses:
 *       200:
 *         description: Sucesso ao buscar tarefas regulares
 *       400:
 *         description: Erro ao buscar tarefas regulares
 */

router.get('/buscarRegulares', async(req, res)=>{
    try{
        const tarefas = await tarefaService.buscarRegular(req)
        res.status(200).json(tarefas)
    }catch(erro){
        res.status(400).json('Não foi possivel buscar tarefas: ' + erro)
    } 
})

/**
 * @swagger
 * /buscarBaixas:
 *   get:
 *     summary: Busca todas as tarefas de baixa prioridade
 *     responses:
 *       200:
 *         description: Sucesso ao buscar tarefas de baixa prioridade
 *       400:
 *         description: Erro ao buscar tarefas de baixa prioridade
 */

router.get('/buscarBaixas', async(req, res)=>{
    try{
        const tarefas = await tarefaService.buscarBaixa(req)
        res.status(200).json(tarefas)
    }catch(erro){
        res.status(400).json('Não foi possivel buscar tarefas: ' + erro)
    } 
})



module.exports = router