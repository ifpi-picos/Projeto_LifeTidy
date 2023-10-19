// Esse e o arquivo de navegação pelas rotas

//Importações
const express = require('express')

//Rotas
const usuariosRouter = require('./usuarios')

//Criando sistema de navegação de rotas
const router = express.Router()

//Resposta que o servidor está online

router.get('/', (req, res)=>{
    res.send('Online!')
})

//Usando as rotas

router.use('/usuarios', usuariosRouter)

// Exportando o router para ser utilizado em outros módulos
module.exports = router;