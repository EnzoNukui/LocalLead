function obterIconePorDescricao(descricao) {
    const texto = descricao.toLowerCase();

    if (
        texto.includes("tempestade") ||
        texto.includes("thunder") ||
        texto.includes("storm")
    ) {
        return "⛈️";
    }

    if (
        texto.includes("chuva") ||
        texto.includes("rain") ||
        texto.includes("drizzle") ||
        texto.includes("shower")
    ) {
        return "🌧️";
    }

    if (
        texto.includes("neblina") ||
        texto.includes("fog") ||
        texto.includes("mist")
    ) {
        return "🌫️";
    }

    if (
        texto.includes("parcialmente") ||
        texto.includes("partly")
    ) {
        return "⛅";
    }

    if (
        texto.includes("nublado") ||
        texto.includes("cloud") ||
        texto.includes("overcast")
    ) {
        return "☁️";
    }


    if (
        texto.includes("ensolarado") ||
        texto.includes("céu limpo") ||
        texto.includes("sol") ||
        texto.includes("sun") ||
        texto.includes("clear")
    ) {
        return "☀️";
    }

    return "🌤️";
}

function traduzirDescricaoClima(descricao) {
    const texto = descricao.toLowerCase();

    if (texto.includes("cloudy") || texto.includes("overcast")) {
        return "Nublado";
    }

    if (texto.includes("partly cloudy")) {
        return "Parcialmente nublado";
    }

    if (texto.includes("clear")) {
        return "Céu limpo";
    }

    if (texto.includes("sunny")) {
        return "Ensolarado";
    }

    if (texto.includes("rain")) {
        return "Chuva";
    }

    if (texto.includes("light rain")) {
        return "Chuva fraca";
    }

    if (texto.includes("heavy rain")) {
        return "Chuva forte";
    }

    if (texto.includes("mist") || texto.includes("fog")) {
        return "Neblina";
    }

    if (texto.includes("thunder") || texto.includes("storm")) {
        return "Tempestade";
    }

    return "Condição variável";
}

async function buscarClima(lat, lon) {
    const url = `https://wttr.in/${lat},${lon}?format=j1`;

    const resposta = await fetch(url, {
        headers: {
            "User-Agent": "LocalLead-MVP"
        }
    });

    if (!resposta.ok) {
        throw new Error(`Erro wttr.in: ${resposta.status}`);
    }

    const dados = await resposta.json();

    const climaAtual = dados.current_condition[0];

    const temperatura = Number(climaAtual.temp_C);
    const chuvaAgora = Number(climaAtual.precipMM || 0);
    const descricao = climaAtual.weatherDesc[0].value;
    const descricaoTraduzida = traduzirDescricaoClima(descricao);

    const horasHoje = dados.weather[0].hourly.slice(0, 6);

    const maiorProbabilidade = Math.max(
        ...horasHoje.map(hora => Number(hora.chanceofrain || 0))
    );

    let riscoAtraso = "baixo";
    let mensagem = "Clima normal, sem previsões para atrasos.";

    if (maiorProbabilidade >= 70 || chuvaAgora > 5) {
        riscoAtraso = "alto";
        mensagem = "Chuva forte prevista. Possível impacto na operação.";
    } else if (maiorProbabilidade >= 40 || chuvaAgora > 0) {
        riscoAtraso = "moderado";
        mensagem = "Chance de chuva. Acompanhe possíveis alterações.";
    }

    return {
        temperatura,
        chuvaAgora,
        maiorProbabilidade,
        riscoAtraso,
        mensagem,
        icone: obterIconePorDescricao(descricaoTraduzida),
        descricao: descricaoTraduzida,
        codigoClima: climaAtual.weatherCode,
        fonte: "wttr.in"
    };
}

module.exports = {
    buscarClima
};