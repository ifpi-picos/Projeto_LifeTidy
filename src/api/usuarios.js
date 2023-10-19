//Importações
const express = require('express')
const { usuario } = require ('../models')
const UsuarioService = require('../services/usuario')

//Navegação de rotas
const router = express.Router()
const usuarioService = new UsuarioService(usuario)

router.get('/', async (req, res) =>{
    const usuarios = await usuarioService.get() 
    res.status(200).json(usuarios)
});

router.post('/', async (req, res) => {
    const {nome, email, senha, telefone} = req.body;
    try{
        await usuarioService.adicionar({nome, email, senha, telefone})
        res.status(201).send("Usuário adicionado com sucesso")  
    } catch (erro){
        res.status(400).send("Não foi possivel adicionar o Usuário")
    }
});

// Exportando o router para ser utilizado em outros módulos
module.exports = router