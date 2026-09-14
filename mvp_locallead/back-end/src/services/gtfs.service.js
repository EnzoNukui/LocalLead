const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");

function lerCSV(nomeArquivo) {
    const caminho = path.join(__dirname, "..", "..", "data", "gtfs", nomeArquivo);
    const conteudo = fs.readFileSync(caminho, "utf-8");

    return parse(conteudo, {
        columns: false,
        skip_empty_lines: true,
        from_line: 2
    });
}

const gtfs = {
    stops: lerCSV("stops.txt"),
    stopTimes: lerCSV("stop_times.txt"),
    trips: lerCSV("trips.txt"),
    frequencias: lerCSV("frequencies.txt")
};

function buscarTripPorLinhaEDestino(linha, destino) {
    return gtfs.trips.find(trip =>
        trip[0] === `CPTM L${linha}` &&
        trip[3].toLowerCase() === destino.toLowerCase()
    );
}

module.exports = {
    gtfs,
    buscarTripPorLinhaEDestino
};