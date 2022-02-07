const express = require('express');
const router = express.Router();
const mysql = require('../database/mysql').pool;
const bcrypt = require('bcrypt');

router.post('/cadastro', (req, res, next) => {
    mysql.getConnection((error, conn) => {

        if (error) {
            return res.status(500).send({
                error: error
            })
        }

        conn.query(
            'SELECT * FROM usuarios WHERE email = ?;',
            [req.body.email],
            (error, resultado, field) => {

                if (error) {
                    return res.status(500).send({
                        error: error
                    })
                }

                if (resultado.length > 0) {
                    return res.status(409).send({
                        mensagem: 'O email informado ja se encontra cadastrado!'
                    });
                }

                bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
                    if (errBcrypt) {
                        return res.status(500).send({
                            error: errBcrypt
                        })
                    }

                    conn.query(`INSERT INTO usuarios (email, senha) VALUES (?, ?)`,
                        [req.body.email, hash],
                        (error, resultado, field) => {
                            conn.release();

                            if (error) {
                                return res.status(500).send({
                                    error: error
                                })
                            }

                            const response = {
                                mensagem: 'Usuario criado com sucesso!',
                                usuario: {
                                    id: resultado.insertId,
                                    email: req.body.email
                                }
                            }
                            return res.status(201).send(response);
                        }
                    );
                });
            }
        )
    });
});

router.post('/login', (req, res, next) => {
    mysql.getConnection((error, conn) => {

        if (error) {
            return res.status(500).send({
                error: error
            })
        }

        const query = 'SELECT * FROM usuarios WHERE email = ?;'
        const params = [req.body.email];

        conn.query(query, params, (error, resultado) => {
            conn.release();

            if (error) {
                return res.status(500).send({
                    error: error
                })
            }

            if (resultado.length < 1) {
                return res.status(401).send({
                    mensagem: 'Falha na autenticação'
                });
            }

            bcrypt.compare(req.body.senha, resultado[0].senha, (err, result) => {

                if (err) {
                    return res.status(401).send({
                        mensagem: 'Falha na autenticação'
                    });
                }

                if (result) {
                    return res.status(200).send({
                        mensagem: 'Autenticado com sucesso'
                    });
                }

                return res.status(401).send({
                    mensagem: 'Falha na autenticação'
                });
            });
        });
    });
});

module.exports = router;