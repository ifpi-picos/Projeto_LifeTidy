//Importações
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');  

//criando servidor local
const app = express();
const port = 3000;

//código secreto para o token (substitua por uma chave segura)
const secretKey = 'x^U!]$zs,P7mOarq2Eo4';

// Configurar o Body-parser para lidar com dados JSON
app.use(bodyParser.json());

// Configurar o pool de conexões com o PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'lifetidy',
  password: '02020757',
  port: '5432',
});

// Rota para criar um novo usuário
app.post('/api/usuario', async (req, res) => {
    const { nome, email, senha, telefone } = req.body;
  
    if (!nome || !email || !senha || !telefone) {
      return res.status(400).json({ error: 'Nome de usuário, email, senha e telefone são obrigatórios' });
    }
  
    try {
      const queryText = 'INSERT INTO usuario (nome, email, senha, telefone) VALUES ($1, $2, $3, $4) RETURNING *';
      const values = [nome, email, senha, telefone];
  
      const result = await pool.query(queryText, values);
      const newUsuario = result.rows[0];
  
      res.status(201).json(newUsuario);
    } catch (error) {
      console.error('Erro ao inserir usuário:', error);
      res.status(500).json({ error: 'Erro ao criar um novo usuário' });
    }
});

//Rota de login e criação do JWT

app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;

  // Verifique as credenciais do usuário (verifique no banco de dados, por exemplo)
  if (email === 'usuario@email.com' && senha === 'senha123') {
    // Autenticação bem-sucedida, crie um token JWT
    const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });

    res.json({ token });
  } else {
    // Credenciais inválidas
    res.status(401).json({ error: 'Credenciais inválidas' });
  }
});

// Rota para obter todos os usuários
app.get('/api/usuarios', async (req, res) => {
    try {
      const queryText = 'SELECT * FROM usuario';
      const result = await pool.query(queryText);
      const users = result.rows;
      res.status(200).json(users); 
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
  });

// Avisar se o servidor está rodando é em qual porta
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
