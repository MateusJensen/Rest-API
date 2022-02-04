const express = require('express');
const router = express.Router();
const mysql = require('../database/mysql').pool;


router.get('/', (req, res, next) => {
     mysql.getConnection((error, conn) => {

          if (error) {
               return res.status(500).send({
                    error: error
               })
          }

          conn.query('SELECT * FROM produtos;',
               (error, resultado, field) => {

                    if (error) {
                         return res.status(500).send({
                              error: error
                         })
                    }

                    const response = {
                         quantidade: resultado.length,
                         produtos: resultado.map(prod => {
                              return {
                                   id_produto: prod.id_produto,
                                   nome: prod.nome,
                                   preco: prod.preco,
                                   request: {
                                        tipo: 'GET',
                                        descricao: 'Retorna todos os produtos',
                                        url: 'http://localhost:5000/produtos/' + prod.id_produto
                                   }
                              }
                         })
                    }

                    return res.status(200).send(response);
               }
          );
     });
});

router.post('/', (req, res, next) => {
     mysql.getConnection((error, conn) => {

          if (error) {
               return res.status(500).send({
                    error: error
               })
          }

          conn.query('INSERT INTO produtos (nome, preco) VALUES (?, ?)',
               [req.body.nome, req.body.preco],
               (error, resultado, field) => {
                    conn.release();

                    if (error) {
                         return res.status(500).send({
                              error: error
                         })
                    }

                    const response = {
                         mensagem: resultado.id_produto,
                         produto: {
                              nome: req.body.nome,
                              preco: req.body.preco,
                              id_produto: resultado.id_produto,
                              request: {
                                   tipo: 'POST',
                                   descricao: 'Adiciona um produto',
                                   url: 'http://localhost:5000/produtos/'
                              }
                         }
                    }

                    return res.status(200).send(response);

               });
     });
});

router.get('/:id_produto', (req, res, next) => {
     mysql.getConnection((error, conn) => {

          if (error) {
               return res.status(500).send({
                    error: error
               })
          }

          conn.query('SELECT * FROM produtos WHERE id_produto = ?;',
               [req.params.id_produto],
               (error, resultado, field) => {
                    conn.release();

                    if (error) {
                         return res.status(500).send({
                              error: error
                         })
                    }

                    if (resultado.length == 0) {
                         return res.status(404).send({
                              mensagem: "Não foi encontrado produto com esse ID"
                         });
                    }

                    const response = {
                         produto: {
                              nome: resultado[0].nome,
                              preco: resultado[0].preco,
                              id_produto: resultado[0].id_produto,
                              request: {
                                   tipo: 'GET',
                                   descricao: 'Retorna um produto especifico',
                                   url: 'http://localhost:5000/produtos'
                              }
                         }
                    }
                    return res.status(200).send(response);
               }
          );
     });
});

router.patch('/', (req, res, next) => {
     mysql.getConnection((error, conn) => {

          if (error) {
               return res.status(500).send({
                    error: error
               })
          }

          conn.query('UPDATE produtos SET nome = ?, preco = ? WHERE id_produto = ?',
               [req.body.nome, req.body.preco, req.body.id_produto],
               (error, resultado, field) => {
                    conn.release();

                    if (error) {
                         return res.status(500).send({
                              error: error
                         })
                    }

                    const response = {
                         mensagem: "Produto alterado",
                         produto: {
                              nome: req.body.nome,
                              preco: req.body.preco,
                              id_produto: req.body.id_produto,
                              request: {
                                   tipo: "PATCH",
                                   descricao: "Atualiza um produto",
                                   url: "http://localhost:5000/produtos"
                              }
                         }
                    }

                    return res.status(200).send(response);
               }
          );
     });
});

router.delete('/', (req, res, next) => {
     mysql.getConnection((error, conn) => {

          if (error) {
               return res.status(500).send({
                    error: error
               })
          }

          conn.query('SELECT * FROM produtos WHERE id_produto = ?',
               [req.body.id_produto],
               (error, resultado, field) => {

                    if (resultado.length == 0) {
                         return res.status(500).send({
                              error: "Não foi encontrado nenhum produto com esse ID"
                         });
                    }

                    conn.query('DELETE FROM produtos WHERE id_produto = ?',
                         [req.body.id_produto],
                         (error, resultado, field) => {
                              conn.release();

                              if (error) {
                                   return res.status(500).send({
                                        error: error
                                   })
                              }

                              const response = {
                                   mensagem: "Produto excluido",
                                   request: {
                                        tipo: "DELETE",
                                        descricao: "Exclui um produto",
                                        url: "http://localhost:5000/produtos"
                                   }
                              }

                              return res.status(200).send(response);
                         }
                    );
               }
          );
     });
});

module.exports = router;