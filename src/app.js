//Importações
const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken') 
const { sequelize } = require('./models')
const cookieParser = require('cookie-parser')
const cors = require('cors')
require('dotenv').config()
const verificaToken = require('./middleware/autenticacao')
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

//criando servidor local
const app = express()
const port = process.env.PORT

//Configurando o app.js para usar o cookie parser
app.use(cookieParser())

//Habilitar permições para urls diferentes do backend
app.use(cors({
  origin: process.env.CLIENTE_URL,
  credentials: true,
  methods: 'GET, PUT, POST, OPTIONS, DELETE',
}))

//Importando o arquivo de navegação pelas rotas (index.js)
const routers = require('./api')

//Configuando para manipular dados JSON
app.use(express.json())

app.all('*', (req, res, next)=>{
  const rotasPublicas = process.env.PUBLIC_ROUTES.split(',')
  if (req.path.startsWith('/usuarios/recuperacao/')) {
    return next();
  }

  for (let i = 0; i < rotasPublicas.length; i += 1) {
    if (req.path == rotasPublicas[i]) {
      return next()
    }
  }
  verificaToken(req, res, next)
})

//Configurando para navegar quando a URL padrão for chamada
app.use('/', routers)

//Aviso que a conexão foi bem sucedida
sequelize.sync().then(()=>{
  console.log('conectadado ao banco')
})

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'APIs do sistema',
      description: 'Informações das rotas de usuário e tarefas',
      contact: {
        name: 'Desenvolvedores Lifetidy'
      },
      servers: ['https://lifetidy.onrender.com']
    }
  },
  apis: ['./src/api/usuario.js', './src/api/tarefas.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Avisar se o servidor está rodando e em qual porta.
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`)
});