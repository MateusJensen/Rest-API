const express = require('express');
const router = express.Router();
const tools = require('../functions/functions');
const mysql = require('../database/mysql').pool;
const multer = require('multer');
const storage = multer.diskStorage({
     destination: function(req, file, cb) {
          cb(null, './uploads/');
     },
     filename: function (req, file, cb) {
          cb(null, tools.time + file.originalname);
     }
});
const upload = multer({
     storage: storage,
     limits: {
          fileSize: 1024 * 1024 * 5
     },
     fileFilter: tools.fileFilter
});


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
                                   imagem: 'http://localhost:5000/' + prod.imagem_produto,
                                   request: {
                                        tipo: 'GET',
                                        descricao: 'Retorna dados de um produto especifico',
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

router.post('/', upload.single('produto_imagem'),(req, res, next) => {
     mysql.getConnection((error, conn) => {

          if (error) {
               return res.status(500).send({
                    error: error
               })
          }

          conn.query('INSERT INTO produtos (nome, preco, imagem_produto) VALUES (?, ?, ?)',
               [req.body.nome, req.body.preco, req.file.path],
               (error, resultado, field) => {
                    conn.release();

                    if (error) {
                         return res.status(500).send({
                              error: error
                         })
                    }

                    const response = {
                         produto: {
                              nome: req.body.nome,
                              preco: req.body.preco,
                              imagem: 'http://localhost:5000/' + req.file.path,
                              request: {
                                   tipo: 'GET',
                                   descricao: 'Retorna todos os produtos',
                                   url: 'http://localhost:5000/produtos'
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
                              imagem: `http://localhost:5000/${resultado[0].imagem_produto}`,
                              request: {
                                   tipo: 'GET',
                                   descricao: 'Retorna todos os produtos',
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
                                   tipo: "GET",
                                   descricao: "Retorna todos os produtos",
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
                                        tipo: "POST",
                                        descricao: "Adiciona um produto",
                                        body: {
                                             nome: "nome do produto",
                                             preco: "preco do produto",
                                             imagem: 'inserir arquivo de imagem | opcional'
                                        },
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