const intervalosFimSemana = {
    "11": {
        trechoDivisor: "Guaianases",

        sabado: [
            {
                inicio: "04:00",
                fim: "10:00",
                intervaloAntesDivisor: 5.5,
                intervaloDepoisDivisor: 11
            },
            {
                inicio: "10:00",
                fim: "19:00",
                intervaloAntesDivisor: 8,
                intervaloDepoisDivisor: 8
            },
            {
                inicio: "19:00",
                fim: "20:00",
                intervaloAntesDivisor: 10,
                intervaloDepoisDivisor: 10
            },
            {
                inicio: "20:00",
                fim: "24:00",
                intervaloAntesDivisor: 35,
                intervaloDepoisDivisor: 35
            }
        ],

        domingo: [
            {
                inicio: "04:00",
                fim: "24:00",
                intervaloAntesDivisor: 35,
                intervaloDepoisDivisor: 35
            }
        ]
    },

    "12": {
        sabado: [
            {
                inicio: "04:00",
                fim: "18:00",
                intervalo: 8
            },
            {
                inicio: "18:00",
                fim: "21:00",
                intervalo: 10
            },
            {
                inicio: "21:00",
                fim: "24:00",
                intervalo: 35
            }
        ],

        domingo: [
            {
                inicio: "04:00",
                fim: "24:00",
                intervalo: 35
            }
        ]
    }
};

module.exports = intervalosFimSemana;