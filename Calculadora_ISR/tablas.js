// Tarifa mensual de ISR 2026
// Artículo 96 de la Ley del ISR

const tablaISRMensual = Object.freeze([

    {
        limiteInferior: 0.01,
        limiteSuperior: 844.59,
        cuotaFija: 0.00,
        porcentaje: 1.92
    },

    {
        limiteInferior: 844.60,
        limiteSuperior: 7168.51,
        cuotaFija: 16.22,
        porcentaje: 6.40
    },

    {
        limiteInferior: 7168.52,
        limiteSuperior: 12598.02,
        cuotaFija: 420.95,
        porcentaje: 10.88
    },

    {
        limiteInferior: 12598.03,
        limiteSuperior: 14644.64,
        cuotaFija: 1011.68,
        porcentaje: 16.00
    },

    {
        limiteInferior: 14644.65,
        limiteSuperior: 17533.63,
        cuotaFija: 1339.14,
        porcentaje: 17.92
    },

    {
        limiteInferior: 17533.64,
        limiteSuperior: 35362.83,
        cuotaFija: 1856.84,
        porcentaje: 21.36
    },

    {
        limiteInferior: 35362.84,
        limiteSuperior: 55736.68,
        cuotaFija: 5665.16,
        porcentaje: 23.52
    },

    {
        limiteInferior: 55736.69,
        limiteSuperior: 106410.50,
        cuotaFija: 10457.09,
        porcentaje: 30.00
    },

    {
        limiteInferior: 106410.51,
        limiteSuperior: 141880.66,
        cuotaFija: 25659.23,
        porcentaje: 32.00
    },

    {
        limiteInferior: 141880.67,
        limiteSuperior: 425641.99,
        cuotaFija: 37009.69,
        porcentaje: 34.00
    },

    {
        limiteInferior: 425642.00,
        limiteSuperior: Infinity,
        cuotaFija: 133488.54,
        porcentaje: 35.00
    }

]);