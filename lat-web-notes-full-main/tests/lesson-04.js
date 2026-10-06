// Preparar el proyecto para Vercel
// Requiere que el servidor esté en ejecución: npm run dev:server
// Ejecutar con: node tests/lesson-04.js

const BASE_URL = 'http://localhost:3000';
const testEmail = `vercel_test_${Date.now()}@example.com`;

const title = 'Preparar el proyecto para Vercel';
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

await test('GET /health — responde con el estado de la aplicación', async () => {
  const res = await fetch(`${BASE_URL}/health`);
  assert(res.status === 200, `se esperaba 200, se recibió ${res.status}`);
  const body = await res.json();
  assert(body.success === true, 'se esperaba success: true');
  assert(
    body.data?.status === 'ok',
    `se esperaba data.status: "ok", se recibió ${JSON.stringify(body.data)}`
  );
});

await test('GET /notes — sigue exigiendo un token', async () => {
  const res = await fetch(`${BASE_URL}/notes`);
  assert(res.status === 401, `se esperaba 401, se recibió ${res.status}`);
});

await test('La API sigue funcionando de principio a fin', async () => {
  const register = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: 'password123', name: 'Test User' }),
  });
  assert(register.status === 201, `el registro devolvió ${register.status}, se esperaba 201`);

  const login = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: 'password123' }),
  });
  assert(
    login.status !== 429,
    'el limitador de la lección anterior sigue contando intentos — reinicia el servidor y vuelve a ejecutar la prueba'
  );
  assert(login.status === 200, `el inicio de sesión devolvió ${login.status}, se esperaba 200`);
  const { data } = await login.json();
  const token = data?.token;
  assert(token, 'no se recibió un token al iniciar sesión');

  const create = await fetch(`${BASE_URL}/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title: 'Nota de prueba', body: 'Contenido' }),
  });
  assert(create.status === 201, `la creación devolvió ${create.status}, se esperaba 201`);

  const list = await fetch(`${BASE_URL}/notes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  assert(list.status === 200, `la lista devolvió ${list.status}, se esperaba 200`);
  const notes = (await list.json()).data;
  assert(
    Array.isArray(notes) && notes.length === 1,
    `se esperaba una nota en la lista, se recibieron ${notes?.length}`
  );
});

console.log(`\n${passed} aprobadas, ${failed} fallidas`);

if (failed === 0) {
  const code = Buffer.from('d2M0LWpieHI=', 'base64').toString();
  console.log(`\nCódigo de verificación: ${code}`);
}

process.exit(failed > 0 ? 1 : 0);
