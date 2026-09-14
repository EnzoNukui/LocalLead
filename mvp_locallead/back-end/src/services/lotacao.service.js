function obterHoraAtual() {
    const agoraBrasil = new Date().toLocaleString("en-US", {
        timeZone: "America/Sao_Paulo"
    });

    const dataBrasil = new Date(agoraBrasil);

    return dataBrasil.getHours();
}

function obterTipoDia() {
    const diaSemana = new Date().getDay();

    if (diaSemana === 0) {
        return "domingo";
    }

    if (diaSemana === 6) {
        return "sabado";
    }

    return "util";
}

function buscarLotacaoPorHorario(linha) {
    const hora = obterHoraAtual();
    const tipoDia = obterTipoDia();

    if (hora < 4) {
    return {
        linha,
        nivel: "sem-operacao",
        mensagem: "Linha fora do horário de operação."
    };
}

    let nivel = "baixa";
    let mensagem = "Fluxo tranquilo neste horário.";

    if (tipoDia === "domingo") {
    return {
        linha,
        nivel: "baixa",
        mensagem: "Fluxo reduzido devido à operação de domingo."
    };
}

    if (tipoDia === "sabado") {

    if (hora >= 5 && hora < 9) {
        return {
            linha,
            nivel: "moderada",
            mensagem: "Fluxo moderado no início da manhã de sábado."
        };
    }

    if (hora >= 9 && hora < 17) {
        return {
            linha,
            nivel: "baixa",
            mensagem: "Fluxo tranquilo durante o dia."
        };
    }

    if (hora >= 17 && hora < 20) {
        return {
            linha,
            nivel: "moderada",
            mensagem: "Fluxo moderado no final da tarde e início da noite."
        };
    }

    return {
        linha,
        nivel: "baixa",
        mensagem: "Fluxo reduzido neste horário de sábado."
    };
}

    if (hora >= 5 && hora < 6) {
        nivel = "moderada";
        mensagem = "Fluxo começando a aumentar.";
    }

    if (hora >= 6 && hora < 9) {
        nivel = "alta";
        mensagem = "Horário de pico. Expectativa de maior lotação.";
    }

    if (hora >= 9 && hora < 16) {
        nivel = "moderada";
        mensagem = "Fluxo intermediário durante o dia.";
    }

    if (hora >= 16 && hora < 20) {
        nivel = "alta";
        mensagem = "Horário de pico no retorno para casa.";
    }

    if (hora >= 20) {
    nivel = "baixa";
    mensagem = "Fluxo reduzido neste horário.";
}

    return {
        linha,
        nivel,
        mensagem
    };
}

module.exports = {
    buscarLotacaoPorHorario
};