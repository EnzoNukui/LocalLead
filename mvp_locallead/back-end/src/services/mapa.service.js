const {
    gtfs,
    buscarTripPorLinhaEDestino
} = require("./gtfs.service");

function buscarMapaLinha(linha, destino) {
    const trip = buscarTripPorLinhaEDestino(linha, destino);

    if (!trip) {
        throw new Error("Viagem não encontrada");
    }

    const tripId = trip[2];

    const paradasDaTrip = gtfs.stopTimes
        .filter(stopTime => stopTime[0] === tripId)
        .sort((a, b) => Number(a[4]) - Number(b[4]));

    const estacoes = paradasDaTrip.map(stopTime => {
        const stopId = stopTime[3];

        const stop = gtfs.stops.find(stop => stop[0] === stopId);

        return {
            id: stopId,
            nome: stop ? stop[1] : "Estação desconhecida",
            ordem: Number(stopTime[4])
        };
    });

    return {
        linha,
        destino,
        estacoes
    };
}

module.exports = {
    buscarMapaLinha
};