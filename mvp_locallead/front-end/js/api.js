const API_BASE_URL = "https://locallead-api.onrender.com";

async function buscarStatus() {
    const resposta = await fetch(`${API_BASE_URL}/status`);
    return resposta.json();
}

async function buscarClima(lat, lon) {
    const resposta = await fetch(`${API_BASE_URL}/clima?lat=${lat}&lon=${lon}`);
    return resposta.json();
}

async function buscarEstacaoProxima(linha, lat, lon) {
    const resposta = await fetch(
        `${API_BASE_URL}/estacao-proxima?linha=${linha}&lat=${lat}&lon=${lon}`
    );
    return resposta.json();
}

async function buscarProximosTrens(linha, estacao, destino) {
    const resposta = await fetch(
        `${API_BASE_URL}/proximos-trens?linha=${linha}&estacao=${encodeURIComponent(estacao)}&destino=${destino}`
    );
    return resposta.json();
}

async function buscarMapaLinha(linha, destino) {
    const resposta = await fetch(
        `${API_BASE_URL}/mapa-linha?linha=${linha}&destino=${destino}`
    );
    return resposta.json();
}

async function buscarLotacao(linha) {
    const resposta = await fetch(`${API_BASE_URL}/lotacao?linha=${linha}`);
    return resposta.json();
}

async function buscarVagoes(linha, destino) {
    const resposta = await fetch(
        `${API_BASE_URL}/vagoes?linha=${linha}&destino=${encodeURIComponent(destino)}`
    );

    return resposta.json();
}