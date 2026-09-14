const express = require("express");

const {
    buscarLotacaoPorHorario
} = require("../services/lotacao.service");

const router = express.Router();

router.get("/lotacao", (req, res) => {
    const { linha } = req.query;

    if (!linha) {
        return res.status(400).json({
            erro: "Informe a linha"
        });
    }

    const lotacao = buscarLotacaoPorHorario(linha);

    res.json(lotacao);
});

module.exports = router;