const { gtfs } = require("./gtfs.service");

function calcularDistanciaKm(lat1, lon1, lat2, lon2) {
    const R = 6371;

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

function buscarEstacaoMaisProximaPorLinha(linha, latUsuario, lonUsuario) {
    const tripIdsDaLinha = new Set();

    gtfs.trips.forEach(trip => {
        const routeId = trip[0];
        const tripId = trip[2];

        if (routeId === `CPTM L${linha}`) {
            tripIdsDaLinha.add(tripId);
        }
    });

    const stopIdsDaLinha = new Set();

    gtfs.stopTimes.forEach(stopTime => {
        const tripId = stopTime[0];
        const stopId = stopTime[3];

        if (tripIdsDaLinha.has(tripId)) {
            stopIdsDaLinha.add(stopId);
        }
    });

    const estacoesDaLinha = gtfs.stops.filter(stop =>
        stopIdsDaLinha.has(stop[0])
    );

    const estacoesComDistancia = estacoesDaLinha.map(stop => ({
        id: stop[0],
        nome: stop[1],
        lat: Number(stop[3]),
        lon: Number(stop[4]),
        distanciaKm: calcularDistanciaKm(
            Number(latUsuario),
            Number(lonUsuario),
            Number(stop[3]),
            Number(stop[4])
        )
    }));

    const estacaoMaisProxima = estacoesComDistancia
        .sort((a, b) => a.distanciaKm - b.distanciaKm)[0];

    return {
        id: estacaoMaisProxima.id,
        nome: estacaoMaisProxima.nome,
        distanciaKm: Number(estacaoMaisProxima.distanciaKm.toFixed(2))
    };
}

module.exports = {
    buscarEstacaoMaisProximaPorLinha
};