// Esse e o arquivo de navegação pelas rotas

//Importação do express
const express = require('express')

//Criando um sistema de rotas para a URL /usuarios
const usuariosRouter = require('./usuarios')

//Criando um sistema de navegação com o objeto router 
const router = express.Router()

//Resposta que o servidor está online
router.get('/', (req, res)=>{
    res.send('Online!')
})

//Manipulando as rotas com usuariosRouter
router.use('/usuarios', usuariosRouter)

// Exportando o router para ser utilizado em outros módulos
module.exports = router;