const boton = document.getElementById("calcular");
const salario = document.getElementById("salario");
const resultado = document.getElementById("resultado");
const periodo = document.getElementById("periodo");


function dinero(numero) {

    return numero.toLocaleString("es-MX", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

}


function redondear(numero) {

    return Math.round((numero + Number.EPSILON) * 100) / 100;

}


// Buscar rango mensual de ISR
function obtenerRango(sueldo) {

    for (const fila of tablaISRMensual) {

        if (
            sueldo >= fila.limiteInferior &&
            sueldo <= fila.limiteSuperior
        ) {

            return fila;

        }

    }

    return null;

}


// Calcular ISR mensual
function calcularISR(sueldo) {

    const rango = obtenerRango(sueldo);

    if (!rango) {

        return null;

    }

    const excedente = redondear(
        sueldo - rango.limiteInferior
    );

    const impuestoVariable = redondear(
        excedente * (rango.porcentaje / 100)
    );

    const isr = redondear(
        rango.cuotaFija + impuestoVariable
    );

    return {
        rango,
        excedente,
        impuestoVariable,
        isr
    };

}


// Botón calcular
boton.addEventListener("click", function () {

    const sueldo = Number(salario.value);
    const periodoSeleccionado = periodo.value;


    if (salario.value.trim() === "") {

        resultado.style.color = "red";

        resultado.innerHTML =
            "⚠️ Escribe un salario.";

        return;

    }


    if (!Number.isFinite(sueldo) || sueldo <= 0) {

        resultado.style.color = "red";

        resultado.innerHTML =
            "⚠️ El salario debe ser mayor que cero.";

        return;

    }


    if (periodoSeleccionado !== "mensual") {

        resultado.style.color = "red";

        resultado.innerHTML =
            "⚠️ Por ahora, la calculadora solo tiene disponible la tarifa mensual.";

        return;

    }


    const datos = calcularISR(sueldo);


    if (!datos) {

        resultado.style.color = "red";

        resultado.innerHTML =
            "⚠️ No se encontró un rango para ese salario.";

        return;

    }


    const neto = redondear(
        sueldo - datos.isr
    );


    resultado.style.color = "#111827";


    resultado.innerHTML = `
        <div class="resultado-principal">

            <h3>Resultado estimado</h3>

            <div class="dato">
                <strong>Sueldo bruto:</strong>
                <span>$${dinero(sueldo)}</span>
            </div>

            <div class="dato">
                <strong>ISR estimado:</strong>
                <span>$${dinero(datos.isr)}</span>
            </div>

            <div class="dato neto">
                <strong>Sueldo después de ISR:</strong>
                <span>$${dinero(neto)}</span>
            </div>

        </div>

        <hr>

        <h3>Desglose del cálculo</h3>

        <div class="dato">
            <strong>Periodo:</strong>
            <span>
                ${periodo.options[periodo.selectedIndex].text}
            </span>
        </div>

        <div class="dato">
            <strong>Límite inferior:</strong>
            <span>
                $${dinero(datos.rango.limiteInferior)}
            </span>
        </div>

        <div class="dato">
            <strong>Límite superior:</strong>
            <span>
                ${
                    datos.rango.limiteSuperior === Infinity
                        ? "En adelante"
                        : "$" + dinero(datos.rango.limiteSuperior)
                }
            </span>
        </div>

        <div class="dato">
            <strong>Cuota fija:</strong>
            <span>
                $${dinero(datos.rango.cuotaFija)}
            </span>
        </div>

        <div class="dato">
            <strong>Excedente del límite inferior:</strong>
            <span>
                $${dinero(datos.excedente)}
            </span>
        </div>

        <div class="dato">
            <strong>Porcentaje aplicado:</strong>
            <span>
                ${datos.rango.porcentaje}%
            </span>
        </div>

        <div class="dato">
            <strong>Impuesto sobre el excedente:</strong>
            <span>
                $${dinero(datos.impuestoVariable)}
            </span>
        </div>

        <div class="dato">
            <strong>ISR total:</strong>
            <span>
                $${dinero(datos.isr)}
            </span>
        </div>
    `;

});


// Permitir calcular presionando Enter
salario.addEventListener("keydown", function (evento) {

    if (evento.key === "Enter") {

        boton.click();

    }

});