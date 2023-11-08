    /*Esse arquivo é responsável por definir rotas relacionadas a usuários
Realizar validações de dados, interagir com serviços para realizar operações no banco de dados
Exportar o objeto router para uso em outros módulos do seu aplicativo*/

//Importações
const express = require('express')
const { usuario } = require ('../models')
const UsuarioService = require('../services/usuario')
const {body, check, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken');  
const verificaToken = require('../middleware/autenticacao')
const router = express.Router()

//Nova instância da classe UsuarioService como o objeto usuario
const usuarioService = new UsuarioService(usuario)

//Rota para retornar todos os usuarios do banco de dados 
router.get('/', async (req, res) =>{
    const usuarios = await usuarioService.get() 
    res.status(200).json(usuarios)
})

//Rota para cadastrar os usuarios no banco de dados 
router.post('/', 
    //Validações e dos atributos dos usuarios
    body('nome').not().isEmpty().trim().escape(),
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
//Rota para login
router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        const { token, userData } = await usuarioService.login(email, senha);

        // Configura o cookie com o token
        res.cookie('token', token, { maxAge: 3600000, httpOnly: true, sameSite: 'strict', secure: true});
        res.status(200).json({ auth: true, user: userData, message: 'Login bem sucedido!' });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

//Rota deletar usuario
router.delete('/apagar', async (req, res) => {
    const id = req.body.id
    try {
        await usuarioService.deletar(id, res)
    } catch (error) {
        res.status(400).json("Não foi possível excluir o usuário!")
    }
});

//Mudar nome de úsuario
router.put('/mudarNome', async (req, res)=>{
    try{
        const {id, novoNome} = req.body
        const usuario = await usuarioService.mudarNome(id, novoNome)
        res.status(200).json({usuario, menssage: 'Nome alterado com sucesso!'})
    }catch(error){
        res.status(400).json({error: error.message})
    }
})

//Mudar email

router.put('/mudarEmail', async (req, res)=>{
    try{
        const {id, novoEmail} = req.body
        const usuario = await usuarioService.mudarEmail(id, novoEmail)
        res.status(200).json({usuario, menssage: 'Email alterado com sucesso!'})
    }catch(error){
        res.status(400).json({error: error.message})
    }
})

router.put('/mudarTelefone', async (req, res)=>{
    try{
        const {id, novoTelefone} = req.body
        const usuario = await usuarioService.mudarTelefone(id, novoTelefone)
        res.status(200).json({usuario, menssage: 'Telefone alterado com sucesso!'})
    }catch(error){
        res.status(400).json({error: error.message})
    }
})

router.put('/mudarSenha', async (req, res)=>{
    try{
        const {id, senhaAntiga, novaSenha} = req.body   
        const usuario = await usuarioService.mudarSenha(id, senhaAntiga, novaSenha)
        res.status(200).json({usuario, menssage: 'Senha alterada com sucesso!'})
    }catch(error){
        res.status(400).json({error: error.message})
    }
})
// Exportando o router para ser utilizado em outros módulos
module.exports = router 
 