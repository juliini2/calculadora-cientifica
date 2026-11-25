const test = require('node:test');
const assert = require('node:assert/strict');
const { calcular } = require('../script.js');

test('resuelve las cuatro operaciones aritméticas', () => {
  assert.equal(calcular('suma', '8', '3').valor, 11);
  assert.equal(calcular('resta', '8', '3').valor, 5);
  assert.equal(calcular('multiplicacion', '8', '3').valor, 24);
  assert.equal(calcular('division', '8', '4').valor, 2);
});

test('rechaza campos vacíos, valores no finitos y división por cero', () => {
  assert.equal(calcular('suma', '', '2').error, 'Ingresá el primer número.');
  assert.equal(calcular('suma', 'Infinity', '2').error, 'Ingresá números válidos y finitos.');
  assert.equal(calcular('division', '2', '0').error, 'No se puede dividir por cero.');
});

test('calcula potencias y raíz cuadrada mostrando la operación', () => {
  assert.deepEqual(calcular('potencia', '3', '4'), { valor: 81, detalle: 'Potencia: 3 ^ 4 = 81' });
  assert.deepEqual(calcular('raiz', '81', ''), { valor: 9, detalle: 'Raíz cuadrada: √81 = 9' });
});

test('rechaza raíces negativas y resultados científicos no finitos', () => {
  assert.equal(calcular('raiz', '-1', '').error, 'La raíz cuadrada no admite números negativos.');
  assert.equal(calcular('potencia', '10', '1000').error, 'El resultado no es un número finito.');
});

test('cambiar una entrada u operación invalida el cálculo anterior', () => {
  const { actualizarEntrada, actualizarOperacion, crearEstado } = require('../script.js');
  const calculado = { ...crearEstado(), entradaA: '2', entradaB: '3', resultado: '5', aviso: 'Cuenta resuelta.' };
  assert.deepEqual(actualizarEntrada(calculado, 'entradaA', '4'), {
    ...calculado, entradaA: '4', resultado: null, aviso: '', detalle: ''
  });
  assert.equal(actualizarOperacion(calculado, 'raiz').resultado, null);
  assert.equal(actualizarOperacion(calculado, 'raiz').entradaB, '3');
});

test('estado inicial es Sumar y limpiar reinicia la cuenta', () => {
  const { limpiarEstado, crearEstado } = require('../script.js');
  assert.deepEqual(crearEstado(), { entradaA: '', entradaB: '', operacion: 'suma', resultado: null, aviso: '', detalle: '' });
  assert.deepEqual(limpiarEstado({ entradaA: '8', entradaB: '2', operacion: 'division', resultado: '4', aviso: 'ok', detalle: '8 ÷ 2' }), crearEstado());
});

const { formatear } = require('../script.js');
assert.equal(formatear(0.1 + 0.2), '0,3');
assert.notEqual(formatear(1e-15), '0');
assert.match(calcular('suma', '0.1', '0.2').detalle, /0,3$/);
