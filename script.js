(function (global) {
  'use strict';
  const nombres = { suma: 'Suma', resta: 'Resta', multiplicacion: 'Multiplicación', division: 'División', potencia: 'Potencia', raiz: 'Raíz cuadrada' };
  const simbolos = { suma: '+', resta: '−', multiplicacion: '×', division: '÷', potencia: '^' };

  function formatear(valor) {
    return new Intl.NumberFormat('es-AR', { maximumSignificantDigits: 12 }).format(valor);
  }

  function calcular(operacion, entradaA, entradaB) {
    const esRaiz = operacion === 'raiz';
    if (String(entradaA).trim() === '') return { error: 'Ingresá el primer número.' };
    if (!esRaiz && String(entradaB).trim() === '') return { error: 'Ingresá el segundo número.' };
    const a = Number(entradaA), b = esRaiz ? null : Number(entradaB);
    if (!Number.isFinite(a) || (!esRaiz && !Number.isFinite(b))) return { error: 'Ingresá números válidos y finitos.' };
    if (esRaiz && a < 0) return { error: 'La raíz cuadrada no admite números negativos.' };
    if (operacion === 'division' && b === 0) return { error: 'No se puede dividir por cero.' };
    const funciones = { suma: () => a + b, resta: () => a - b, multiplicacion: () => a * b, division: () => a / b, potencia: () => a ** b, raiz: () => Math.sqrt(a) };
    if (!funciones[operacion]) return { error: 'Elegí una operación válida.' };
    const valor = funciones[operacion]();
    if (!Number.isFinite(valor)) return { error: 'El resultado no es un número finito.' };
    const cuenta = esRaiz ? `√${formatear(a)} = ${formatear(valor)}` : `${formatear(a)} ${simbolos[operacion]} ${formatear(b)} = ${formatear(valor)}`;
    return { valor, detalle: `${nombres[operacion]}: ${cuenta}` };
  }

  function crearEstado() { return { entradaA: '', entradaB: '', operacion: 'suma', resultado: null, aviso: '', detalle: '' }; }
  function invalidar(estado, cambios) { return { ...estado, ...cambios, resultado: null, aviso: '', detalle: '' }; }
  function actualizarEntrada(estado, campo, valor) {
    if (!['entradaA', 'entradaB'].includes(campo)) throw new Error('Campo de entrada desconocido.');
    return invalidar(estado, { [campo]: valor });
  }
  function actualizarOperacion(estado, operacion) { return invalidar(estado, { operacion }); }
  function limpiarEstado() { return crearEstado(); }
  function calcularEstado(estado) {
    const calculo = calcular(estado.operacion, estado.entradaA, estado.entradaB);
    return calculo.error
      ? { ...estado, resultado: null, aviso: calculo.error, detalle: '' }
      : { ...estado, resultado: calculo.valor, aviso: 'Cuenta resuelta.', detalle: calculo.detalle };
  }
  const api = { formatear, calcular, crearEstado, actualizarEntrada, actualizarOperacion, limpiarEstado, calcularEstado };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof document === 'undefined') return;

  const form = document.querySelector('#formulario-calculo'), campoA = document.querySelector('#numero-a');
  const campoB = document.querySelector('#numero-b'), operacion = document.querySelector('#operacion');
  const salida = document.querySelector('#resultado'), aviso = document.querySelector('#aviso'), detalle = document.querySelector('#detalle');
  let estado = crearEstado();
  function renderizar() {
    salida.textContent = estado.resultado === null ? '—' : formatear(estado.resultado);
    aviso.textContent = estado.aviso; detalle.textContent = estado.detalle || 'Tu operación aparecerá acá.';
    campoB.disabled = estado.operacion === 'raiz';
    campoB.setAttribute('aria-disabled', String(campoB.disabled));
    document.querySelector('.separador').textContent = campoB.disabled ? ' ' : simbolos[estado.operacion];
  }
  function leerCampos() {
    estado = { ...estado, entradaA: campoA.value, entradaB: campoB.value, operacion: operacion.value };
  }
  function cambiarCampo(evento) {
    const campo = evento.currentTarget === campoA ? 'entradaA' : 'entradaB';
    estado = actualizarEntrada(estado, campo, evento.currentTarget.value); renderizar();
  }
  campoA.addEventListener('input', cambiarCampo); campoB.addEventListener('input', cambiarCampo);
  operacion.addEventListener('change', () => { estado = actualizarOperacion(estado, operacion.value); renderizar(); });
  form.addEventListener('submit', (evento) => { evento.preventDefault(); leerCampos(); estado = calcularEstado(estado); renderizar(); });
  document.querySelector('#limpiar').addEventListener('click', () => {
    estado = limpiarEstado(); form.reset(); renderizar(); campoA.focus();
  });
  renderizar();
})(typeof globalThis !== 'undefined' ? globalThis : this);
