let estacaoAtual = null;
let intervaloAtualizacao = null;

let dadosEstacaoAtual = null;
let dadosClimaAtual = null;
let dadosLotacaoAtual = null;
let dadosMapaAtual = null;
let dadosStatusAtual = null;
let dadosVagoesAtual = null;

let abaAtual = "horarios";

const linhaDetalhes = document.getElementById("linha-detalhes");

const params = new URLSearchParams(window.location.search);
const linhaSelecionada = params.get("linha");

const configLinhas = {
    "11": {
        nome: "Linha 11-Coral",
        sentidoCentro: "LUZ",
        sentidoOposto: "ESTUDANTES",
        imagem: "./assets/images/linha_11.jpg"
    },
    "12": {
        nome: "Linha 12-Safira",
        sentidoCentro: "BRAS",
        sentidoOposto: "CALMON VIANA",
        imagem: "./assets/images/linha_12.jpg"
    }
};

let destinoAtual = configLinhas[linhaSelecionada].sentidoCentro;

function obterLocalizacao() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

function renderizarTrens(trens) {
    return trens.proximos.length > 0
        ? trens.proximos.map(trem => `
            <article class="trem-card">
                <strong class="tempo-chegada">
                    ${trem.chegaEm <= 0
                ? "Já"
                : `${trem.chegaEm} min`
            }
                </strong>

                <p class="horario-previsto">
                    Previsto às ${trem.horarioEstimado}
                </p>
            </article>
        `).join("")
        : "<p>Nenhum trem encontrado para este horário.</p>";
}

async function atualizarProximosTrens() {
    if (!estacaoAtual) return;

    const trens = await buscarProximosTrens(
        linhaSelecionada,
        estacaoAtual,
        destinoAtual
    );

    const container = document.getElementById("proximos-trens-container");

    if (!container) return;

    container.innerHTML = renderizarTrens(trens);
}

function renderizarVagoes(vagoes) {
    if (!vagoes) {
        return "<p>Informações dos vagões indisponíveis.</p>";
    }

    if (vagoes.nivelLinha === "sem-operacao") {
        return `
        <section class="vagoes-section">
            <h2>Ocupação dos vagões</h2>

            <div class="vagoes-sem-operacao">
                <p>Lotação indisponível</p>
                <small>
                    A linha não possui operação neste horário.
                </small>
            </div>
        </section>
    `;
    }

    const frenteDireita =
        destinoAtual === "BRAS" ||
        destinoAtual === "LUZ";

    const indiceAtual = dadosMapaAtual.estacoes.findIndex(estacao =>
        estacao.nome.toLowerCase() === estacaoAtual.toLowerCase()
    );

    const proximasEstacoes = dadosMapaAtual.estacoes
        .slice(indiceAtual + 1)
        .map(estacao => estacao.nome.toLowerCase());

    const saidasFiltradas = vagoes.saidas.filter(saida =>
        proximasEstacoes.includes(saida.estacao.toLowerCase())
    );

    return `
        <section class="vagoes-section">
            <h2>Ocupação dos vagões</h2>

            <div class="frente-trem ${frenteDireita ? "direita" : "esquerda"}">
                <span>
                ${frenteDireita ? "Frente do trem →" : "← Frente do trem"}
                </span>
            </div>

            <div class="vagoes-lista">
                ${vagoes.vagoes.map(vagao => `
                    <div class="vagao vagao-${vagao.nivel}">
                        <strong>${vagao.numero}</strong>
                    </div>
                `).join("")}
            </div>

            <div class="legenda-vagoes">
    <div class="legenda-item">
        <span class="legenda-cor baixa"></span>
        <small>Baixa</small>
    </div>

    <div class="legenda-item">
        <span class="legenda-cor moderada"></span>
        <small>Moderada</small>
    </div>

    <div class="legenda-item">
        <span class="legenda-cor alta"></span>
        <small>Alta</small>
    </div>
</div>

            <div class="vagao-recomendado">
                <small>Menor lotação estimada</small>
                <strong>Vagões ${vagoes.recomendado.numeros.join(", ")}</strong>
                <p>${vagoes.recomendado.motivo}</p>
            </div>

            <div class="saidas-principais">
    <h3>Saídas mais rápidas</h3>

    ${saidasFiltradas.map(saida => `
        <div class="saida-item">
            <strong>${saida.estacao}</strong>
            <span>Vagão ${saida.vagao}</span>
            <p>${saida.motivo}</p>
        </div>
    `).join("")}
</div>
        </section>
    `;
}

function renderizarTelaLinha(trens, mapa) {
    let classeOperacao = "operacao-indisponivel";

    if (dadosStatusAtual) {

        const situacao =
            dadosStatusAtual.situacao.toLowerCase();

        if (
            situacao.includes("normal")
        ) {
            classeOperacao = "operacao-normal";
        }

        else if (
            situacao.includes("reduzida") ||
            situacao.includes("atenção")
        ) {
            classeOperacao = "operacao-atencao";
        }

        else if (
            situacao.includes("interrompida") ||
            situacao.includes("paralisada")
        ) {
            classeOperacao = "operacao-alerta";
        }
    }

    let avisoOperacao = "";

    if (classeOperacao === "operacao-atencao") {
        avisoOperacao = `
        <div class="alerta-operacao alerta-amarela">
            <strong>⚠️ Velocidade reduzida</strong>
            <p>Os trens estão circulando com velocidade reduzida.</p>
        </div>
    `;
    }

    if (classeOperacao === "operacao-alerta") {
        avisoOperacao = `
        <div class="alerta-operacao alerta-vermelha">
            <strong>🚫 Restrição operacional</strong>
            <p>A linha opera com restrições.</p>
        </div>
    `;
    }

    let statusOperacao = `
    <div class="operacao-topo ${classeOperacao}">
        ● ${dadosStatusAtual ? dadosStatusAtual.situacao : "Status indisponível"}
    </div>
`;

    linhaDetalhes.innerHTML = `
    <header class="linha-topo">
        <a href="./index.html" class="btn-voltar">
    <span>←</span>
    <span>Voltar</span>
</a>

        <div class="linha-titulo">

    <img
        src="${configLinhas[linhaSelecionada].imagem}"
        alt="${configLinhas[linhaSelecionada].nome}"
        class="linha-header-icone">

    <h1>${configLinhas[linhaSelecionada].nome}</h1>

</div>
    </header>

    ${statusOperacao}

    ${avisoOperacao}


    <section class="clima-operacao-card">
    <div class="clima-info">

    <span class="clima-icone">
        ${dadosClimaAtual.icone}
    </span>

    <div>
        <p>${dadosClimaAtual.mensagem}</p>

    </div>

    <h2>
        ${dadosClimaAtual.temperatura}°
    </h2>

</div>
</section>

    <section class="estacao-atual-card">
        <small>Sentido Atual</small>

        <div class="estacao-linha">
            <h2>${destinoAtual}</h2>

            <button id="btn-trocar-sentido">
            <i data-lucide="repeat"></i>
                Trocar sentido
            </button>
        </div>
    </section>

    <section class="tabs-linha">
    <button class="tab ativa" id="tab-horarios">Horários</button>
    <button class="tab" id="tab-vagoes">Vagões</button>
</section>

<section class="conteudo-tabs" id="conteudo-tabs">
    <div class="horarios-section">
        <div id="proximos-trens-container">
            ${renderizarTrens(trens)}
        </div>
    </div>
</section>

    <section class="mapa-section">
        <h2>Mapa da Linha</h2>

        <div class="mapa-linha">
           

            ${(() => {
            const indiceAtual = mapa.estacoes.findIndex(estacao =>
                estacao.nome.toLowerCase() === dadosEstacaoAtual.estacao.nome.toLowerCase()
            );

            return mapa.estacoes.map((estacaoMapa, index) => {
                const isEstacaoPassada = index < indiceAtual;
                const isEstacaoAtual = index === indiceAtual;

                return `
            <div class="estacao-mapa 
                ${isEstacaoPassada ? "estacao-passada" : ""} 
                ${isEstacaoAtual ? "estacao-atual" : ""}
            ">
                <span class="ponto"></span>

                <p>
                    ${estacaoMapa.nome}

                    ${isEstacaoAtual
                        ? `<span class="tag-estacao-atual">Você está aqui</span>`
                        : ""
                    }
                </p>
            </div>
        `;
            }).join("");
        })()}
        </div>
    </section>
`;
    lucide.createIcons();

    document
        .getElementById("btn-trocar-sentido")
        .addEventListener("click", trocarSentido);

    const tabHorarios = document.getElementById("tab-horarios");
    const tabVagoes = document.getElementById("tab-vagoes");
    const conteudoTabs = document.getElementById("conteudo-tabs");

    tabHorarios.addEventListener("click", () => {
        abaAtual = "horarios";
        tabHorarios.classList.add("ativa");
        tabVagoes.classList.remove("ativa");

        conteudoTabs.innerHTML = `
        <div class="horarios-section">
            <div id="proximos-trens-container">
                ${renderizarTrens(trens)}
            </div>
        </div>
    `;
    });

    tabVagoes.addEventListener("click", () => {
        abaAtual = "vagoes";

        tabVagoes.classList.add("ativa");
        tabHorarios.classList.remove("ativa");

        conteudoTabs.innerHTML = renderizarVagoes(dadosVagoesAtual);
    });

    if (abaAtual === "vagoes") {
        tabVagoes.click();
    }


}
async function trocarSentido() {
    destinoAtual =
        destinoAtual === configLinhas[linhaSelecionada].sentidoCentro
            ? configLinhas[linhaSelecionada].sentidoOposto
            : configLinhas[linhaSelecionada].sentidoCentro;

    const trens = await buscarProximosTrens(
        linhaSelecionada,
        estacaoAtual,
        destinoAtual
    );

    const mapa = await buscarMapaLinha(
        linhaSelecionada,
        destinoAtual
    );
    dadosMapaAtual = mapa;

    const vagoes = await buscarVagoes(
        linhaSelecionada,
        destinoAtual
    );

    dadosVagoesAtual = vagoes;

    renderizarTelaLinha(trens, mapa);

    if (intervaloAtualizacao) {
        clearInterval(intervaloAtualizacao);
    }

    intervaloAtualizacao = setInterval(
        atualizarProximosTrens,
        30000
    );
}

async function carregarLinha() {
    try {
        linhaDetalhes.innerHTML = `
            <h1>${configLinhas[linhaSelecionada].nome}</h1>
            <p>Buscando sua localização...</p>
        `;


        const posicao = await obterLocalizacao();

        const lat = posicao.coords.latitude;
        const lon = posicao.coords.longitude;

        const estacao = await buscarEstacaoProxima(
            linhaSelecionada,
            lat,
            lon
        );

        estacaoAtual = estacao.estacao.nome;

        const [
            clima,
            lotacao,
            statusLinhas,
            trens,
            mapa,
            vagoes
        ] = await Promise.all([
            buscarClima(lat, lon),
            buscarLotacao(linhaSelecionada),
            buscarStatus(),
            buscarProximosTrens(
                linhaSelecionada,
                estacaoAtual,
                destinoAtual
            ),
            buscarMapaLinha(
                linhaSelecionada,
                destinoAtual
            ),
            buscarVagoes(
                linhaSelecionada,
                destinoAtual
            )
        ]);

        const statusLinhaAtual = Array.isArray(statusLinhas)
            ? statusLinhas.find(linha => linha.codigo === linhaSelecionada)
            : null;

        dadosStatusAtual = statusLinhaAtual;
        dadosVagoesAtual = vagoes;


        dadosEstacaoAtual = estacao;
        dadosClimaAtual = clima;
        dadosLotacaoAtual = lotacao;
        dadosMapaAtual = mapa;

        renderizarTelaLinha(trens, mapa);

        if (intervaloAtualizacao) {
            clearInterval(intervaloAtualizacao);
        }

        intervaloAtualizacao = setInterval(
            atualizarProximosTrens,
            30000
        );

    } catch (erro) {
        console.error(erro);

        linhaDetalhes.innerHTML = `
            <h1>Erro</h1>
            <p>Não foi possível carregar os dados da linha.</p>
        `;
    }
}

lucide.createIcons();
carregarLinha();