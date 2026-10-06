// Validación en el servidor
// Requiere que el servidor esté en ejecución: npm run dev:server
// Ejecutar con: node tests/lesson-02.js

const BASE_URL = 'http://localhost:3000';
const testEmail = `validation_test_${Date.now()}@example.com`;
const validEmail = `validation_ok_${Date.now()}@example.com`;

const title = 'Validación en el servidor';
console.log(`\n${title}\n`);

let passed = 0;
let failed = 0;

async function test(name, fn) {
  try {
    await fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (err) {
    console.log(`❌ ${name} — ${err.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

await test('POST /auth/register — devuelve 400 con una contraseña de menos de 8 caracteres', async () => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: 'short', name: 'Test User' }),
  });
  assert(res.status === 400, `se esperaba 400, se recibió ${res.status}`);
  const body = await res.json();
  assert(body.success === false, 'se esperaba success: false');
  assert(body.error?.message, 'se esperaba que error.message estuviera presente');
});

await test('POST /auth/register — el mensaje de error menciona la longitud de la contraseña', async () => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: `short2_${Date.now()}@example.com`, password: 'abc', name: 'Test User' }),
  });
  const body = await res.json();
  const message = body.error?.message ?? '';
  assert(
    message.toLowerCase().includes('contraseña') && /\d/.test(message),
    `se esperaba que el mensaje mencionara la contraseña y un número, se recibió: "${message}"`
  );
});

await test('POST /auth/register — la cuenta no se crea cuando la contraseña es corta', async () => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: 'short' }),
  });
  assert(
    res.status === 401,
    `se esperaba 401 porque el usuario no debería existir, se recibió ${res.status} — comprueba que la validación va antes de crear al usuario`
  );
});

await test('POST /auth/register — devuelve 201 con una contraseña de exactamente 8 caracteres', async () => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: validEmail, password: 'exactly8', name: 'Test User' }),
  });
  assert(res.status === 201, `se esperaba 201, se recibió ${res.status}`);
  const body = await res.json();
  assert(body.success === true, 'se esperaba success: true');
});

console.log(`\n${passed} aprobadas, ${failed} fallidas`);

if (failed === 0) {
  const code = Buffer.from('ZHE3LW1obHM=', 'base64').toString();
  console.log(`\nCódigo de verificación: ${code}`);
}

process.exit(failed > 0 ? 1 : 0);
