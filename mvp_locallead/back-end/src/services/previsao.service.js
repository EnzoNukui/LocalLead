const {
    gtfs,
    buscarTripPorLinhaEDestino
} = require("./gtfs.service");

const intervalosFimSemana =
    require("../../data/tabelas/intervalos-fim-semana");

function horarioParaMinutos(horario) {
    const [h, m] = horario.split(":");
    return Number(h) * 60 + Number(m);
}

function minutosParaHorario(minutos) {
    const h = Math.floor(minutos / 60).toString().padStart(2, "0");
    const m = Math.floor(minutos % 60).toString().padStart(2, "0");

    return `${h}:${m}`;
}

function obterTipoDia() {

    const hoje = new Date().getDay();

    if (hoje === 0) {
        return "domingo";
    }

    if (hoje === 6) {
        return "sabado";
    }

    return "util";
}

function buscarFaixaFimSemana(
    linha,
    minutosAgora
) {

    const tipoDia = obterTipoDia();

    if (tipoDia === "util") {
        return null;
    }

    const tabelaLinha =
        intervalosFimSemana[linha];

    if (!tabelaLinha) {
        return null;
    }

    const faixas =
        tabelaLinha[tipoDia];

    if (!faixas) {
        return null;
    }

    return faixas.find(faixa => {

        const inicio =
            horarioParaMinutos(faixa.inicio);

        const fim =
            horarioParaMinutos(faixa.fim);

        return (
            minutosAgora >= inicio &&
            minutosAgora <= fim
        );
    });
}

function calcularDeslocamentoEstacao(tripId, estacao) {
    const paradasDaTrip = gtfs.stopTimes
        .filter(stopTime => stopTime[0] === tripId)
        .sort((a, b) => Number(a[4]) - Number(b[4]));

    if (paradasDaTrip.length === 0) {
        return 0;
    }

    const primeiraParada = paradasDaTrip[0];

    const paradaEstacao = paradasDaTrip.find(stopTime => {
        const stopId = stopTime[3];

        const stop = gtfs.stops.find(stop => stop[0] === stopId);

        if (!stop) return false;

        return stop[1].toLowerCase() === estacao.toLowerCase();
    });

    if (!paradaEstacao) {
        return 0;
    }

    const horarioOrigem = horarioParaMinutos(primeiraParada[1]);
    const horarioEstacao = horarioParaMinutos(paradaEstacao[1]);

    return horarioEstacao - horarioOrigem;
}

function buscarProximosTrens(linha, estacao, destino) {
    const trip = buscarTripPorLinhaEDestino(linha, destino);

    if (!trip) {
        throw new Error("Viagem não encontrada");
    }

    const tripId = trip[2];
    const deslocamentoEstacao =
        calcularDeslocamentoEstacao(tripId, estacao);

    const agoraBrasil = new Date().toLocaleString("en-US", {
        timeZone: "America/Sao_Paulo"
    });

    const dataBrasil = new Date(agoraBrasil);

    const minutosAgora =
    dataBrasil.getHours() * 60 + dataBrasil.getMinutes();

    const faixaFimSemana = buscarFaixaFimSemana(
        linha,
        minutosAgora
    );

    if (faixaFimSemana) {
        let intervaloMinutos = faixaFimSemana.intervalo;

if (linha === "11") {
    const estacoesTrechoCentro = [
        "Guaianases",
        "José Bonifácio",
        "Dom Bosco",
        "Corinthians-Itaquera",
        "Tatuapé",
        "Brás",
        "Luz"
    ];

    const estaNoTrechoCentro = estacoesTrechoCentro
        .map(nome => nome.toLowerCase())
        .includes(estacao.toLowerCase());

    intervaloMinutos = estaNoTrechoCentro
        ? faixaFimSemana.intervaloAntesDivisor
        : faixaFimSemana.intervaloDepoisDivisor;
}

        const inicioFaixa =
            horarioParaMinutos(faixaFimSemana.inicio) + deslocamentoEstacao;

        const fimFaixa =
            horarioParaMinutos(faixaFimSemana.fim) + deslocamentoEstacao;

        const proximos = [];

        for (
            let horario = inicioFaixa;
            horario <= fimFaixa;
            horario += intervaloMinutos
        ) {
            if (horario >= minutosAgora) {
                proximos.push({
                    chegaEm: Math.round(horario - minutosAgora),
                    horarioEstimado: minutosParaHorario(horario)
                });
            }

            if (proximos.length === 3) {
                break;
            }
        }

        return {
            linha,
            estacao,
            destino,
            operandoAgora: proximos.length > 0,
            intervaloMinutos,
            origemIntervalo: "tabela-fim-semana",
            proximos
        };
    }

    const frequenciaAtual = gtfs.frequencias.find(freq => {
        const freqTripId = freq[0];
        const inicio = horarioParaMinutos(freq[1]);
        const fim = horarioParaMinutos(freq[2]);

        return (
            freqTripId === tripId &&
            minutosAgora >= inicio &&
            minutosAgora <= fim
        );
    });

    if (!frequenciaAtual) {
        return {
            linha,
            estacao,
            destino,
            operandoAgora: false,
            mensagem: "Não há frequência programada para este horário.",
            proximos: []
        };
    }

    const intervaloMinutos =
        Number(frequenciaAtual[3]) / 60;

    const inicioFaixa =
        horarioParaMinutos(frequenciaAtual[1]) + deslocamentoEstacao;

    const fimFaixa =
        horarioParaMinutos(frequenciaAtual[2]) + deslocamentoEstacao;

    const proximos = [];

    for (
        let horario = inicioFaixa;
        horario <= fimFaixa;
        horario += intervaloMinutos
    ) {
        if (horario >= minutosAgora) {
            proximos.push({
                chegaEm: Math.round(horario - minutosAgora),
                horarioEstimado: minutosParaHorario(horario)
            });
        }

        if (proximos.length === 3) {
            break;
        }
    }

    return {
        linha,
        estacao,
        destino,
        operandoAgora: true,
        intervaloMinutos,
        proximos
    };
}

module.exports = {
    buscarProximosTrens
};