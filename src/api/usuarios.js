//Importações
const express = require('express')
const { usuario } = require ('../models')
const UsuarioService = require('../services/usuario')
const {body, check, validationResult} = require('express-validator')

//Navegação de rotas
const router = express.Router()
const usuarioService = new UsuarioService(usuario)

router.get('/', async (req, res) =>{
    const usuarios = await usuarioService.get() 
    res.status(200).json(usuarios)
});

router.post('/', 
    body('nome', 'telefone').not().isEmpty().trim().escape(),
    body('email').isEmail().normalizeEmail(),
    check('senha')
        .isLength({min: 8})
        .withMessage('Essa senha deve ter pelo menos 8 caracteres'),
    async (req, res) => {
    const erros = validationResult(req)
    if (!erros.isEmpty()){
        return res.status(400).json({erros: erros.array()})
    }
    const {nome, email, senha, telefone} = req.body;
    try{
        await usuarioService.adicionar({nome, email, senha, telefone})
        res.status(201).send("Usuário adicionado com sucesso")  
    } catch (erro){
        res.status(400).send(erro.message)
    }
});

// Exportando o router para ser utilizado em outros módulos
module.exports = router