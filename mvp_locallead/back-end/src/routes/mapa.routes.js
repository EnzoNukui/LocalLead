const express = require("express");

const {
    buscarMapaLinha
} = require("../services/mapa.service");

const router = express.Router();

router.get("/mapa-linha", (req, res) => {
    try {
        const { linha, destino } = req.query;

        if (!linha || !destino) {
            return res.status(400).json({
                erro: "Informe linha e destino"
            });
        }

        const mapa = buscarMapaLinha(linha, destino);

        res.json(mapa);

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: "Erro ao buscar mapa da linha"
        });
    }
});

module.exports = router;