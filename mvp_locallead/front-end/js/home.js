const linhasContainer = document.getElementById("linhas-container");
const climaContainer = document.getElementById("clima-container");

function obterLocalizacao() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

async function carregarClimaHome() {
    try {
        const posicao = await obterLocalizacao();

        const lat = posicao.coords.latitude;
        const lon = posicao.coords.longitude;

        const clima = await buscarClima(lat, lon);

        climaContainer.innerHTML = `
            <div class="clima-card">

                <h2>
                    ${clima.icone}
                    ${clima.temperatura}°C
                </h2>

                <p>
                    ${clima.descricao}
                </p>

                <p>
                    <strong>Risco de atraso:</strong>
                    ${clima.riscoAtraso}
                </p>

                <small>
                    ${clima.mensagem}
                </small>

            </div>
        `;

    } catch (erro) {
        console.error("Erro ao carregar clima:", erro);

        climaContainer.innerHTML = `
            <p>Não foi possível carregar o clima.</p>
        `;
    }
}

function carregarLinhasHome() {
    const linhas = [
        {
            codigo: "11",
            nome: "Linha 11-Coral",
            imagem: "./assets/images/linha_11.jpg",
            cor: "#f97316"
        },
        {
            codigo: "12",
            nome: "Linha 12-Safira",
            imagem: "./assets/images/linha_12.jpg",
            cor: "#2563eb"
        }
    ];

    linhasContainer.innerHTML = linhas.map(linha => `
    <article
    class="linha-card"
    data-linha="${linha.codigo}"
    style="--cor-linha: ${linha.cor};"
>

        <div class="linha-card-esquerda">

            <span
                class="status-indicador status-desconhecido"
                data-status-linha="${linha.codigo}">
            </span>

            <img
                src="${linha.imagem}"
                alt="${linha.nome}"
                class="linha-icone"
            />

        </div>

        <div class="linha-card-centro">
            <h2>${linha.nome}</h2>
            <small>Toque para ver detalhes</small>
        </div>

        <div class="linha-resumo">
    <div>
        <span>Lotação</span>
        <strong data-lotacao-linha="${linha.codigo}">
            Carregando...
        </strong>
    </div>

    <div>
        <span>Intervalo</span>
        <strong data-intervalo-linha="${linha.codigo}">
            Carregando...
        </strong>
    </div>
</div>

        <div class="linha-card-direita">
            ➜
        </div>

    </article>
`).join("");

    document.querySelectorAll(".linha-card").forEach(card => {
        card.addEventListener("click", () => {
            const linha = card.dataset.linha;
            window.location.href = `linha.html?linha=${linha}`;
        });
    });
}

async function atualizarIndicadoresStatus() {
    try {
        const statusLinhas = await buscarStatus();

        if (!Array.isArray(statusLinhas)) {
            return;
        }

        statusLinhas.forEach(linha => {
            const indicador = document.querySelector(
                `[data-status-linha="${linha.codigo}"]`
            );

            if (!indicador) return;

            indicador.classList.remove(
                "status-desconhecido",
                "status-normal",
                "status-atencao",
                "status-alerta",
                "status-encerrado"
            );

            if (linha.situacao === "Operação Normal") {
                indicador.classList.add("status-normal");
            } else if (linha.situacao === "Velocidade Reduzida") {
                indicador.classList.add("status-atencao");
            } else if (
                linha.situacao === "Paralisada" ||
                linha.situacao === "Operação Parcial"
            ) {
                indicador.classList.add("status-alerta");
            } else {
                indicador.classList.add("status-encerrado");
            }
        });

    } catch (erro) {
        console.error("Não foi possível atualizar status:", erro);
    }
}

async function atualizarResumoLinhas() {
    const linhasResumo = [
        {
            codigo: "11",
            estacaoPadrao: "Suzano",
            destinoPadrao: "LUZ"
        },
        {
            codigo: "12",
            estacaoPadrao: "Jardim Romano",
            destinoPadrao: "BRAS"
        }
    ];

    for (const linha of linhasResumo) {
        try {
            const lotacao = await buscarLotacao(linha.codigo);

            const previsao = await buscarProximosTrens(
                linha.codigo,
                linha.estacaoPadrao,
                linha.destinoPadrao
            );

            const lotacaoElemento = document.querySelector(
                `[data-lotacao-linha="${linha.codigo}"]`
            );

            const intervaloElemento = document.querySelector(
                `[data-intervalo-linha="${linha.codigo}"]`
            );

            if (lotacaoElemento) {
                lotacaoElemento.textContent = lotacao.nivel;

                lotacaoElemento.classList.remove(
                    "lotacao-baixa",
                    "lotacao-media",
                    "lotacao-alta"
                );

                if (lotacao.nivel.toLowerCase() === "baixa") {
                    lotacaoElemento.classList.add("lotacao-baixa");
                }

                if (lotacao.nivel.toLowerCase() === "media") {
                    lotacaoElemento.classList.add("lotacao-media");
                }

                if (lotacao.nivel.toLowerCase() === "alta") {
                    lotacaoElemento.classList.add("lotacao-alta");
                }
            }

            if (intervaloElemento) {
                intervaloElemento.textContent = previsao.intervaloMinutos
                    ? `${previsao.intervaloMinutos} min`
                    : "Indisponível";
            }

        } catch (erro) {
            console.error(`Erro ao atualizar resumo da linha ${linha.codigo}:`, erro);
        }
    }
}

lucide.createIcons();
carregarClimaHome();
carregarLinhasHome();
atualizarIndicadoresStatus();
atualizarResumoLinhas();