// Esse e o arquivo de navegação pelas rotas

//Importação do express
const express = require('express')

//Criando um sistema de rotas para a URL /usuarios
const usuariosRouter = require('./usuarios')
const tarefasRouter = require('./tarefas')
const itensRouter = require('./itens')

//Criando um sistema de navegação com o objeto router 
const router = express.Router()
//Resposta que o servidor está online
router.get('/', (req, res)=>{
    res.send('Online!')
})

router.use('/usuarios', usuariosRouter)
router.use('/tarefas', tarefasRouter)
router.use('/itens', itensRouter)

// Exportando o router para ser utilizado em outros módulos
module.exports = router;