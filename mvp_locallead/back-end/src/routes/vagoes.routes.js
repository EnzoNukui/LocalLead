const express = require("express");

const {
    buscarVagoesPorLinha
} = require("../services/vagoes.service");

const router = express.Router();

router.get("/vagoes", (req, res) => {
    try {
        const { linha, destino } = req.query;

        if (!linha || !destino) {
            return res.status(400).json({
                erro: "Informe a linha e o destino"
            });
        }

        const resultado = buscarVagoesPorLinha(linha, destino);

        res.json(resultado);

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: "Erro ao buscar informações dos vagões"
        });
    }
});

module.exports = router;