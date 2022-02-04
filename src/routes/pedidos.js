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

          conn.query(`SELECT pedidos.id_pedido, 
                                        pedidos.quantidade, 
                                        produtos.id_produto, 
                                        produtos.nome, 
                                        produtos.preco 
                              FROM pedidos 
                              JOIN produtos 
                              ON produtos.id_produto = pedidos.id_produto;`,
               (error, resultado, field) => {
                    conn.release();

                    if (error) {
                         return res.status(500).send({
                              error: error
                         })
                    }

                    const response = {
                         pedidos: resultado.map(ped => {
                              return {
                                   id_pedido: ped.id_pedido,
                                   quantidade: ped.quantidade,
                                   produto: {
                                        id_produto: ped.id_produto,
                                        nome: ped.nome,
                                        preco: ped.preco
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

          conn.query('SELECT * FROM produtos WHERE id_produto = ?',
               [req.body.id_produto],
               (error, resultado, field) => {

                    if (resultado.length == 0) {
                         return res.status(500).send({
                              error: "Não foi encontrado nenhum produto com esse ID"
                         });
                    }

                    conn.query('INSERT INTO pedidos (quantidade, id_produto) VALUES (?, ?)',
                         [req.body.quantidade, req.body.id_produto],
                         (error, resultado, field) => {
                              conn.release();

                              if (error) {
                                   return res.status(500).send({
                                        error: error
                                   })
                              }

                              const response = {
                                   mensagem: "Pedido inserido com sucesso!",
                                   request: {
                                        tipo: "POST",
                                        descricao: "Inserir um pedido",
                                        url: "http://localhost:5000/pedidos"
                                   }
                              }

                              return res.status(200).send(response);
                         }
                    );
               }
          );
     });
});

router.get('/:id_pedido', (req, res, next) => {
     mysql.getConnection((error, conn) => {

          if (error) {
               return res.status(500).send({
                    error: error
               })
          }

          conn.query('SELECT * FROM pedidos WHERE id_pedido = ?;',
               [req.params.id_pedido],
               (error, resultado, field) => {
                    conn.release();

                    if (error) {
                         return res.status(500).send({
                              error: error
                         })
                    }

                    if (resultado.length == 0) {
                         return res.status(404).send({
                              mensagem: "Não foi encontrado pedido com esse ID"
                         });
                    }

                    const response = {
                         pedido: {
                              id_pedido: req.params.id_pedido,
                              quantidade: resultado[0].quantidade,
                              id_produto: resultado[0].id_produto,
                              request: {
                                   tipo: 'GET',
                                   descricao: 'Retorna um pedido especifico',
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

          conn.query('SELECT * FROM produtos WHERE id_produto = ?;',
               [req.body.id_produto],
               (error, resultado, field) => {

                    if (error) {
                         return res.status(500).send({
                              error: error
                         })
                    }

                    if (resultado.length == 0) {
                         return res.status(500).send({
                              mensagem: 'Não foi encontrado nenhum produto com esse ID'
                         });
                    }

                    conn.query('SELECT * FROM pedidos WHERE id_pedido = ?;',
                         [req.body.id_pedido],
                         (error, resultado, field) => {

                              if (error) {
                                   return res.status(500).send({
                                        error: error
                                   })
                              }

                              if (resultado.length == 0) {
                                   return res.status(500).send({
                                        mensagem: 'Nao foi encontrado nenhum pedido com esse ID'
                                   })
                              }

                              conn.query('UPDATE pedidos  SET quantidade = ?, id_produto = ? WHERE id_pedido = ?;',
                                   [req.body.quantidade, req.body.id_produto, req.body.id_pedido],
                                   (error, resultado, field) => {
                                        conn.release();

                                        if (error) {
                                             return res.status(500).send({
                                                  error: error
                                             })
                                        }

                                        const response = {
                                             mensagem: "Pedido alterado com sucesso!",
                                             pedido: {
                                                  id_pedido: req.body.id_pedido,
                                                  quantidade: req.body.quantidade,
                                                  id_produto: req.body.id_produto,
                                                  request: {
                                                       tipo: "PATCH",
                                                       descricao: "Atualiza um pedido",
                                                       url: "http://localhost:5000/pedidos"
                                                  }
                                             }
                                        }
                                        return res.status(200).send(response);
                                   }
                              );
                         }
                    );
               });
     });
});

router.delete('/', (req, res, next) => {
     mysql.getConnection((error, conn) => {

          if (error) {
               return res.status(500).send({
                    error: error
               })
          }

          conn.query('SELECT * FROM pedidos WHERE id_pedido = ?',
               [req.body.id_pedido],
               (error, resultado, field) => {

                    if (resultado.length == 0) {
                         return res.status(500).send({
                              error: "Não foi encontrado nenhum pedido com esse ID"
                         });
                    }

                    conn.query('DELETE FROM pedidos WHERE id_pedido = ?',
                         [req.body.id_pedido],
                         (error, resultado, field) => {
                              conn.release();

                              if (error) {
                                   return res.status(500).send({
                                        error: error
                                   })
                              }

                              const response = {
                                   mensagem: "Pedido excluido com sucesso!",
                                   request: {
                                        tipo: "DELETE",
                                        descricao: "Exclui um pedido",
                                        url: "http://localhost:5000/pedidos"
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