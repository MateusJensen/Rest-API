const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) =>{
  res.status(200).send({
    mensagem: 'Usando GET dentro da rota de pedidos'
  });
});

router.post('/', (req, res, next) =>{
  const pedido = {
    id_produto: req.body.id_produto,
    quantidade: req.body.quantidade
  }
  res.status(200).send({
    mensagem: 'Pedido inserido',
    pedido: pedido
  });
});

router.get('/:id_produto', (req, res, next) => {
  const id = req.params.id_produto
  res.status(200).send({
    mensagem: 'Usando GET de um pedido exclusivo', 
    id: id
  });
});

router.patch('/', (req, res, next) => {
  res.status(200).send({
    mensagem: 'Pedido alterado'
  });
});

router.delete('/', (req, res, next) =>{
  res.status(200).send({
    mensagem: 'Pedido excluido'
  });
});

module.exports = router;