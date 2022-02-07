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
            (error, resultado, field) =>{

                if (error) {
                    return res.status(500).send({
                        error: error
                    })
                }

                if (resultado.length > 0){
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

module.exports = router;