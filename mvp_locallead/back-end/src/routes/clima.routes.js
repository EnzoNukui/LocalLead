const express = require("express");

const {
    buscarClima
} = require("../services/clima.service");

const router = express.Router();

router.get("/clima", async (req, res) => {
    try {
        const { lat, lon } = req.query;

        if (!lat || !lon) {
            return res.status(400).json({
                erro: "Informe lat e lon"
            });
        }

        const clima = await buscarClima(lat, lon);

        res.json(clima);

    } catch (erro) {
    console.error("Erro completo na rota /clima:", erro);

    res.status(500).json({
        erro: "Erro ao buscar clima"
    });
}
});

module.exports = router;