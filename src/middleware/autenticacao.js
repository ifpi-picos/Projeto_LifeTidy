const jwt = require('jsonwebtoken');
require('dotenv').config();

function verificarToken(req, res, next) {
  const token = req.cookies ? req.cookies.token : null // token in cookie
  if (!token) {
    return res.status(403).send({
      auth: false, message: 'Nenhum token fornecido.'
    })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).send({
        auth: false,
        message: 'Falha na autenticação. Error -> ' + err
      })
    }
    req.userId = decoded.id
    next()
  })
}

module.exports = verificarToken;
