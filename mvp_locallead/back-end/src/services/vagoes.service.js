const {
    buscarLotacaoPorHorario
} = require("./lotacao.service");

const saidasPrincipais = {
    "11": {
        "LUZ": [
            {
                estacao: "Calmon Viana",
                vagao: 1,
                motivo: "Melhor acesso às escadas e saída principal"
            },
            {
                estacao: "Tatuapé",
                vagao: 4,
                motivo: "Melhor acesso às escadas rolantes e integração"
            },
            {
                estacao: "Brás",
                vagao: 4,
                motivo: "Melhor acesso às escadas e integração"
            },
            {
                estacao: "Luz",
                vagao: 5,
                motivo: "Melhor acesso às escadas rolantes e integrações"
            }
        ],

        "ESTUDANTES": [
            {
                estacao: "Calmon Viana",
                vagao: 8,
                motivo: "Melhor acesso às escadas e saída principal"
            },
            {
                estacao: "Tatuapé",
                vagao: 5,
                motivo: "Melhor acesso às escadas rolantes e integração"
            },
            {
                estacao: "Brás",
                vagao: 5,
                motivo: "Melhor acesso às escadas rolantes e integração"
            },
            {
                estacao: "Luz",
                vagao: 4,
                motivo: "Melhor acesso às escadas rolantes  e integrações"
            }
        ]
    },

    "12": {
        "BRAS": [
            {
                estacao: "Calmon Viana",
                vagao: 3,
                motivo: "Melhor acesso às escadas e saída principal"
            },
            {
                estacao: "Tatuapé",
                vagao: 4,
                motivo: "Melhor acesso às escadas rolantes e integração"
            },
            {
                estacao: "Brás",
                vagao: 4,
                motivo: "Melhor acesso às escadas rolantes e integração"
            }
        ],

        "CALMON VIANA": [
            {
                estacao: "Calmon Viana",
                vagao: 4,
                motivo: "Melhor acesso às escadas e saída principal"
            },
            {
                estacao: "Tatuapé",
                vagao: 5,
                motivo: "Melhor acesso às escadas rolantes e integração"
            },
            {
                estacao: "Brás",
                vagao: 5,
                motivo: "Melhor acesso às escadas rolantes e integração"
            }
        ]
    }
};

function normalizarTexto(texto) {
    return texto.toUpperCase().trim();
}

function gerarOcupacaoVagoes(nivelLinha) {
    if (nivelLinha === "baixa") {
        return [
            "baixa",
            "baixa",
            "baixa",
            "moderada",
            "moderada",
            "baixa",
            "baixa",
            "baixa"
        ];
    }

    if (nivelLinha === "moderada") {
        return [
            "baixa",
            "baixa",
            "moderada",
            "alta",
            "alta",
            "moderada",
            "baixa",
            "baixa"
        ];
    }

    return [
        "moderada",
        "moderada",
        "alta",
        "alta",
        "alta",
        "alta",
        "moderada",
        "moderada"
    ];
}

function escolherVagaoRecomendado(vagoes, nivelLinha) {

    if (nivelLinha === "baixa") {
        return {
            numeros: [3, 6],
            motivo: "Boa combinação entre conforto e acesso às estações."
        };
    }

    if (nivelLinha === "moderada") {
        return {
            numeros: [2, 7],
            motivo: "Menor concentração de passageiros neste horário."
        };
    }

    return {
        numeros: [1, 8],
        motivo: "Extremidades costumam ser menos disputadas nos horários de pico."
    };
}

function buscarSaidasPorDestino(linha, destino) {
    const destinoNormalizado = normalizarTexto(destino);

    if (!saidasPrincipais[linha]) {
        return [];
    }

    return saidasPrincipais[linha][destinoNormalizado] || [];
}

function buscarVagoesPorLinha(linha, destino) {
    const lotacaoLinha = buscarLotacaoPorHorario(linha);

if (lotacaoLinha.nivel === "sem-operacao") {
    return {
        linha,
        destino,
        nivelLinha: "sem-operacao",
        mensagemLinha: "Sem operação neste horário.",
        vagoes: [],
        recomendado: null,
        saidas: []
    };
}

    const ocupacao = gerarOcupacaoVagoes(lotacaoLinha.nivel);

    const vagoes = ocupacao.map((nivel, index) => {
        return {
            numero: index + 1,
            nivel
        };
    });

    return {
        linha,
        destino,
        nivelLinha: lotacaoLinha.nivel,
        mensagemLinha: lotacaoLinha.mensagem,
        vagoes,
        recomendado: escolherVagaoRecomendado(
        vagoes,
        lotacaoLinha.nivel),
        saidas: buscarSaidasPorDestino(linha, destino)
    };
}

module.exports = {
    buscarVagoesPorLinha
};