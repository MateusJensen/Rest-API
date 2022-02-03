const express = require('express');
const pedidos = require('./routes/pedidos');
const produtos = require('./routes/produtos');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.header('Acess-Control-Allow-Origin', '*');
  res.header('Acess-Control-Allow-with', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS'){
    res.header('Acess-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).send({});
  }
  next();
});

app.use('/pedidos', pedidos);
app.use('/produtos', produtos);

app.use((req, res, next) => {
  const erro = new Error('Não encontrado!');
  erro.status = 404;
  next(erro);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  return res.send({
    erro: {
      mensagem: error.message
    }
  });
});

module.exports = app;