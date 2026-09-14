const express = require("express");
const cors = require("cors");

const statusRoutes = require("./routes/status.routes");
const climaRoutes = require("./routes/clima.routes");
const estacaoRoutes = require("./routes/estacao.routes");
const previsaoRoutes = require("./routes/previsao.routes");
const mapaRoutes = require("./routes/mapa.routes");
const lotacaoRoutes = require("./routes/lotacao.routes");
const vagoesRoutes = require("./routes/vagoes.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(statusRoutes);
app.use(climaRoutes);
app.use(estacaoRoutes);
app.use(previsaoRoutes);
app.use(mapaRoutes);
app.use(lotacaoRoutes);
app.use(vagoesRoutes);

app.get("/", (req, res) => {
    res.send("Servidor da LocalLead funcionando!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});