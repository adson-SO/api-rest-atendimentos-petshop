const connection = require('../infrastructure/connection');
const moment = require('moment');
const res = require('express/lib/response');

class Atendimento {
    adiciona(atendimento, res) {
        const dataCriacao = moment().format('YYYY-MM-DD HH:mm:ss');
        const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss');

        const dataEValida = moment(data).isSameOrAfter(dataCriacao);
        const clienteEValido = atendimento.cliente.length >= 5;

        const validacoes = [
            {
                nome: 'data',
                valido: dataEValida,
                mensagem: 'A data deve ser maior ou igual a data atual.'
            },
            {
                nome: 'cliente',
                valido: clienteEValido,
                mensagem: 'Cliente deve ter pelo menos 5 caracteres.'
            }
        ];

        const erros = validacoes.filter(campo => !campo.valido);
        const existemErros = erros.length;

        if (existemErros) {
            res.status(400).json(erros);
        } else {
            const atendimentoDatado = { ...atendimento, dataCriacao, data };
            const sql = 'INSERT INTO Atendimentos SET ?';

            connection.query(sql, atendimentoDatado, (erro, resultados) => {
                if (erro) {
                    res.status(400).json(erro);
                } else {
                    res.status(201).json(atendimento);
                }
            })
        }
    }

    lista(res){
        const sql = 'SELECT * FROM Atendimentos';

        connection.query(sql, (erro, resultados) => {
            if(erro){
                res.status(400).json(erro);
            } else{
                res.status(200).json(resultados);
            }
        });
    }

    buscaPorId(id, res) {
        const sql = `SELECT * FROM Atendimentos WHERE id = ${id}`;

        connection.query(sql, (erro, resultado) => {
            const atendimento = resultado[0];

            if(erro){
                res.status(400).json(erro);
            } else{
                res.status(200).json(atendimento);
            }
        });
    }

    altera(id, valores, res){
        if(valores.data) {
            valores.data = moment(valores.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss');
        }
        
        const sql = 'UPDATE Atendimentos SET ? WHERE id = ?';

        connection.query(sql, [valores, id], (erro, resultado) => {
            if(erro){
                res.status(400).json(erro);
            } else{
                res.status(200).json({...valores, id});
            }
        });
    }

    deleta(id, res) {
        const sql = 'DELETE FROM Atendimentos WHERE id = ?';

        connection.query(sql, id, (erro, resultado) => {
            if(erro) {
                res.status(400).json(erro);
            } else {
                res.status(200).json({id});
            }
        });
    }
}

module.exports = new Atendimento;