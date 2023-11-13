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
router.get('/mostrarUsuarios', async (req, res) =>{
    const usuarios = await usuarioService.get() 
    res.status(200).json(usuarios)
})

//Rota para cadastrar os usuarios no banco de dados 
router.post('/cadastrar', 
    //Validações e dos atributos dos usuarios
    body('nome_usuario').not().isEmpty().trim().escape(),
    body('email').isEmail().normalizeEmail(),
    check('senha')
        .isLength({min: 8})
        .withMessage('Essa senha deve ter pelo menos 8 caracteres'),
    async (req, res) => {
    const erros = validationResult(req)
    if (!erros.isEmpty()){
        return res.status(400).json({erros: erros.array()})
    }
    const {nome_usuario, email, senha, telefone} = req.body;
    try{
        await usuarioService.adicionar({nome_usuario, email, senha, telefone})
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

router.get('/buscarNome', verificaToken, async (req, res)=>{
    try{
        const usuarioNome = await usuarioService.buscarNome(req)
        res.status(200).json({usuarioNome, message: "Nome do usuário encontrado"})
    }catch(erro){
        res.status(500).json("Não foi possivel acessar o nome do usuário")
    }
})
//Rota deletar usuario
router.delete('/apagar', verificaToken , async (req, res) => {
    try {
        await usuarioService.deletar(req,res)
    } catch (error) {
        res.status(400).json("Não foi possível excluir o usuário!")
    }
});

//Mudar nome de úsuario
router.put('/mudarNome', verificaToken, async (req, res)=>{
    try{
        const novoNome = req.body
        const usuario = await usuarioService.mudarNome(req, novoNome, res)
    }catch(erro){
        res.status(400).json('Nome não alterado!')
    }
    
    
})

//Mudar email

router.put('/mudarEmail', async (req, res)=>{
    try{
        const {novoEmail} = req.body
        const usuario = await usuarioService.mudarEmail(req, novoEmail)
        res.status(200).json({usuario, menssage: 'Email alterado com sucesso!'})
    }catch(erro){
        res.status(400).json({error: erro.message})
    }
})

router.put('/mudarTelefone', async (req, res)=>{
    try{
        const {novoTelefone} = req.body
        const usuario = await usuarioService.mudarTelefone(req, novoTelefone)
        res.status(200).json({usuario, menssage: 'Telefone alterado com sucesso!'})
    }catch(error){
        res.status(400).json({error: error.message})
    }
})

router.put('/mudarSenha', async (req, res)=>{
    try{
        const {senhaAntiga, novaSenha} = req.body   
        const usuario = await usuarioService.mudarSenha(req, senhaAntiga, novaSenha)
        res.status(200).json({usuario, menssage: 'Senha alterada com sucesso!'})
    }catch(error){
        res.status(400).json({error: error.message})
    }
})
// Exportando o router para ser utilizado em outros módulos
module.exports = router 
 