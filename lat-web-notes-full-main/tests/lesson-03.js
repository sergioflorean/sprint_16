// Rate limiting
// Requiere que el servidor esté en ejecución: npm run dev:server
// Ejecutar con: node tests/lesson-03.js
//
// NOTA: express-rate-limit guarda las cuentas en la memoria del proceso y las
// reinicia cuando se reinicia el servidor. Si esta prueba falla porque el
// limitador ya se activó en una ejecución anterior, reinicia el servidor con
// npm run dev:server y vuelve a intentarlo.

const BASE_URL = 'http://localhost:3000';

const title = 'Rate limiting';
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

await test('POST /auth/login — devuelve 429 después de demasiadas peticiones', async () => {
  const statuses = [];

  for (let i = 0; i < 15; i++) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'probe@example.com', password: 'wrongpassword' }),
    });
    statuses.push(res.status);
    if (res.status === 429) break;
  }

  const hit429 = statuses.includes(429);
  assert(
    hit429,
    `se enviaron ${statuses.length} peticiones y ninguna devolvió 429 — ¿está el limitador aplicado a POST /auth/login?`
  );
});

await test('GET /notes — no está limitado', async () => {
  const res = await fetch(`${BASE_URL}/notes`);
  assert(
    res.status !== 429,
    'se recibió 429 en GET /notes — el limitador está aplicado de forma global en vez de solo a la ruta de login'
  );
});

await test('POST /auth/register — también tiene su propio límite', async () => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: `limiter_${Date.now()}@example.com`,
      password: 'password123',
      name: 'Test User',
    }),
  });
  assert(
    res.headers.get('x-ratelimit-limit'),
    'la respuesta no trae ninguna cabecera de límite — ¿está el limitador aplicado a POST /auth/register?'
  );
});

console.log(`\n${passed} aprobadas, ${failed} fallidas`);

if (failed === 0) {
  const code = Buffer.from('a2Y1LXp3cWQ=', 'base64').toString();
  console.log(`\nCódigo de verificación: ${code}`);
}

process.exit(failed > 0 ? 1 : 0);
