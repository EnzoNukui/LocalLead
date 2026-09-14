const express = require("express");
const axios = require("axios");

const router = express.Router();

let cacheStatus = null;
let cacheCriadoEm = null;

const TEMPO_CACHE_MS = 5 * 60 * 1000;

router.get("/status", async (req, res) => {
    try {
        const agora = Date.now();

        if (
            cacheStatus &&
            cacheCriadoEm &&
            agora - cacheCriadoEm < TEMPO_CACHE_MS
        ) {
            return res.json(cacheStatus);
        }
        const resposta = await axios.get(
            "https://ccm.artesp.sp.gov.br/metroferroviario/api/status/"
        );

        const empresas = resposta.data.empresas;

        const cptm = empresas.find(empresa =>
            empresa.nome.includes("CPTM")
        );

        const linhasFiltradas = cptm.linhas.filter(linha =>
            linha.codigo === "11" || linha.codigo === "12"
        );

        const resultado = linhasFiltradas.map(linha => ({
            nome: linha.nome,
            codigo: linha.codigo,
            situacao: linha.status.situacao,
            atualizado: linha.status.atualizado_ha,
            operacaoNormal: linha.status.operacao_normal
        }));

        cacheStatus = resultado;
        cacheCriadoEm = Date.now();

        res.json(resultado);

    } catch (erro) {
        console.error(erro.message);

        res.status(500).json({
            erro: "Falha ao buscar status das linhas"
        });
    }
});

module.exports = router;