// ==========================================
// TARIFAS ISR 2026
// Artículo 96 de la Ley del ISR
// ==========================================


// ==========================================
// TARIFA MENSUAL
// ==========================================

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


// ==========================================
// TARIFA QUINCENAL
// ==========================================

const tablaISRQuincenal = Object.freeze([

    {
        limiteInferior: 0.01,
        limiteSuperior: 416.70,
        cuotaFija: 0.00,
        porcentaje: 1.92
    },

    {
        limiteInferior: 416.71,
        limiteSuperior: 3537.15,
        cuotaFija: 7.95,
        porcentaje: 6.40
    },

    {
        limiteInferior: 3537.16,
        limiteSuperior: 6216.15,
        cuotaFija: 207.75,
        porcentaje: 10.88
    },

    {
        limiteInferior: 6216.16,
        limiteSuperior: 7225.95,
        cuotaFija: 499.20,
        porcentaje: 16.00
    },

    {
        limiteInferior: 7225.96,
        limiteSuperior: 8651.40,
        cuotaFija: 660.75,
        porcentaje: 17.92
    },

    {
        limiteInferior: 8651.41,
        limiteSuperior: 17448.75,
        cuotaFija: 916.20,
        porcentaje: 21.36
    },

    {
        limiteInferior: 17448.76,
        limiteSuperior: 27501.60,
        cuotaFija: 2795.25,
        porcentaje: 23.52
    },

    {
        limiteInferior: 27501.61,
        limiteSuperior: 52505.25,
        cuotaFija: 5159.70,
        porcentaje: 30.00
    },

    {
        limiteInferior: 52505.26,
        limiteSuperior: 70006.95,
        cuotaFija: 12660.75,
        porcentaje: 32.00
    },

    {
        limiteInferior: 70006.96,
        limiteSuperior: 210020.70,
        cuotaFija: 18261.30,
        porcentaje: 34.00
    },

    {
        limiteInferior: 210020.71,
        limiteSuperior: Infinity,
        cuotaFija: 65866.05,
        porcentaje: 35.00
    }

]);


// ==========================================
// TARIFA SEMANAL
// ==========================================

const tablaISRSemanal = Object.freeze([

    {
        limiteInferior: 0.01,
        limiteSuperior: 194.46,
        cuotaFija: 0.00,
        porcentaje: 1.92
    },

    {
        limiteInferior: 194.47,
        limiteSuperior: 1650.67,
        cuotaFija: 3.71,
        porcentaje: 6.40
    },

    {
        limiteInferior: 1650.68,
        limiteSuperior: 2900.87,
        cuotaFija: 96.95,
        porcentaje: 10.88
    },

    {
        limiteInferior: 2900.88,
        limiteSuperior: 3372.11,
        cuotaFija: 232.96,
        porcentaje: 16.00
    },

    {
        limiteInferior: 3372.12,
        limiteSuperior: 4037.32,
        cuotaFija: 308.35,
        porcentaje: 17.92
    },

    {
        limiteInferior: 4037.33,
        limiteSuperior: 8142.75,
        cuotaFija: 427.56,
        porcentaje: 21.36
    },

    {
        limiteInferior: 8142.76,
        limiteSuperior: 12834.08,
        cuotaFija: 1304.45,
        porcentaje: 23.52
    },

    {
        limiteInferior: 12834.09,
        limiteSuperior: 24502.45,
        cuotaFija: 2407.86,
        porcentaje: 30.00
    },

    {
        limiteInferior: 24502.46,
        limiteSuperior: 32669.91,
        cuotaFija: 5908.35,
        porcentaje: 32.00
    },

    {
        limiteInferior: 32669.92,
        limiteSuperior: 98009.66,
        cuotaFija: 8521.94,
        porcentaje: 34.00
    },

    {
        limiteInferior: 98009.67,
        limiteSuperior: Infinity,
        cuotaFija: 30737.49,
        porcentaje: 35.00
    }

]);