const express = require("express");

const {
    buscarEstacaoMaisProximaPorLinha
} = require("../services/estacao.service");

const router = express.Router();

router.get("/estacao-proxima", (req, res) => {
    try {
        const { linha, lat, lon } = req.query;

        if (!linha || !lat || !lon) {
            return res.status(400).json({
                erro: "Informe linha, lat e lon"
            });
        }

        const estacao = buscarEstacaoMaisProximaPorLinha(
            linha,
            lat,
            lon
        );

        res.json({
            linha,
            estacao
        });

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: "Erro ao buscar estação próxima"
        });
    }
});

module.exports = router;