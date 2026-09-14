const express = require("express");

const {
    buscarProximosTrens
} = require("../services/previsao.service");

const router = express.Router();

router.get("/proximos-trens", (req, res) => {
    try {
        const { linha, estacao, destino } = req.query;

        if (!linha || !estacao || !destino) {
            return res.status(400).json({
                erro: "Informe linha, estacao e destino"
            });
        }

        const previsao = buscarProximosTrens(
            linha,
            estacao,
            destino
        );

        res.json(previsao);

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: "Erro ao buscar próximos trens"
        });
    }
});

module.exports = router;