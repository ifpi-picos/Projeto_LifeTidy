/*Esse arquivo é responsável por definir rotas relacionadas a usuários
Realizar validações de dados, interagir com serviços para realizar operações no banco de dados
Exportar o objeto router para uso em outros módulos do seu aplicativo*/

//Importações
const express = require('express')
const { usuario } = require ('../models')
const UsuarioService = require('../services/usuario')
const {body, check, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken');  

//Navegação de rotas
const router = express.Router()

//Nova instância da classe UsuarioService como o objeto usuario
const usuarioService = new UsuarioService(usuario)

// Usando a função /get para retornar todos os usuarios do banco de dados 
router.get('/', async (req, res) =>{
    const usuarios = await usuarioService.get() 
    res.status(200).json(usuarios)
});

//Função que usa o metodo post para cadastrar os usuarios no banco de dados 
router.post('/', 
    //Validações e dos atributos dos usuarios
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