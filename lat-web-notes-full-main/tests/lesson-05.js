// Desplegar en Vercel
// Requiere la aplicación desplegada. No usa tu servidor local.
// Ejecutar con: node tests/lesson-05.js https://tu-api.vercel.app

const input = process.argv[2];

if (!input) {
  console.log('\nFalta la dirección de tu API.\n');
  console.log('Ejecuta: npm run test:05 -- https://tu-api.vercel.app\n');
  process.exit(1);
}

if (!input.startsWith('http://') && !input.startsWith('https://')) {
  console.log(`\nLa dirección tiene que empezar con https://. Recibida: ${input}\n`);
  process.exit(1);
}

const BASE_URL = input.replace(/\/+$/, '');
const stamp = Date.now();
const userA = { email: `deploy_a_${stamp}@example.com`, password: 'password123', name: 'Usuario A' };
const userB = { email: `deploy_b_${stamp}@example.com`, password: 'password123', name: 'Usuario B' };

const title = 'Desplegar en Vercel';
console.log(`\n${title}`);
console.log(`Probando ${BASE_URL}\n`);

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

async function readJson(res, what) {
  const type = res.headers.get('content-type') ?? '';
  if (!type.includes('application/json')) {
    throw new Error(
      `${what} no devolvió JSON sino "${type}" — comprueba que la dirección sea la del proyecto del back end y no la del front end`
    );
  }
  return res.json();
}

// Comprobación previa: que la dirección responda algo antes de correr las pruebas
try {
  await fetch(`${BASE_URL}/health`);
} catch {
  console.log(`No se pudo conectar con ${BASE_URL}`);
  console.log('Comprueba que la dirección esté bien escrita y que el despliegue haya terminado.\n');
  process.exit(1);
}

// Datos que van pasando de una prueba a la siguiente
let tokenA;
let tokenB;
let noteId;

await test('GET /health — la aplicación desplegada responde', async () => {
  const res = await fetch(`${BASE_URL}/health`);
  assert(res.status === 200, `se esperaba 200, se recibió ${res.status}`);
  const body = await readJson(res, 'GET /health');
  assert(body.data?.status === 'ok', `se esperaba data.status: "ok", se recibió ${JSON.stringify(body.data)}`);
});

await test('GET /notes — sin token responde 401', async () => {
  const res = await fetch(`${BASE_URL}/notes`);
  assert(res.status === 401, `se esperaba 401, se recibió ${res.status}`);
});

await test('La base de datos en la nube guarda usuarios', async () => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userA),
  });
  assert(
    res.status !== 500,
    'el registro devolvió 500 — revisa MONGO_URI en las variables del proyecto y la lista de direcciones permitidas en Atlas'
  );
  assert(res.status === 201, `se esperaba 201, se recibió ${res.status}`);

  const login = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: userA.email, password: userA.password }),
  });
  assert(
    login.status !== 429,
    'el limitador está contando tus intentos — espera unos minutos antes de volver a ejecutar la prueba'
  );
  assert(login.status === 200, `el inicio de sesión devolvió ${login.status}, se esperaba 200`);
  const body = await readJson(login, 'POST /auth/login');
  tokenA = body.data?.token;
  assert(tokenA, 'no se recibió un token al iniciar sesión');
});

await test('Una nota creada en producción se guarda y se recupera', async () => {
  assert(tokenA, 'no hay token, la prueba anterior falló');

  const create = await fetch(`${BASE_URL}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenA}` },
    body: JSON.stringify({ title: 'Nota desplegada', body: 'Escrita contra la API en línea' }),
  });
  assert(create.status === 201, `la creación devolvió ${create.status}, se esperaba 201`);
  noteId = (await readJson(create, 'POST /notes')).data?._id;
  assert(noteId, 'la respuesta de creación no trae el _id de la nota');

  const list = await fetch(`${BASE_URL}/notes`, {
    headers: { Authorization: `Bearer ${tokenA}` },
  });
  assert(list.status === 200, `la lista devolvió ${list.status}, se esperaba 200`);
  const notes = (await readJson(list, 'GET /notes')).data;
  assert(
    Array.isArray(notes) && notes.some((note) => note._id === noteId),
    'la nota recién creada no aparece en la lista'
  );
});

await test('Otra cuenta no ve ni puede borrar tus notas', async () => {
  assert(noteId, 'no hay nota, la prueba anterior falló');

  const register = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userB),
  });
  assert(register.status === 201, `el registro de la segunda cuenta devolvió ${register.status}`);

  const login = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: userB.email, password: userB.password }),
  });
  assert(
    login.status !== 429,
    'el limitador está contando tus intentos — espera unos minutos antes de volver a ejecutar la prueba'
  );
  assert(login.status === 200, `el inicio de sesión de la segunda cuenta devolvió ${login.status}`);
  tokenB = (await readJson(login, 'POST /auth/login')).data?.token;
  assert(tokenB, 'no se recibió un token para la segunda cuenta');

  const list = await fetch(`${BASE_URL}/notes`, {
    headers: { Authorization: `Bearer ${tokenB}` },
  });
  const notes = (await readJson(list, 'GET /notes')).data;
  assert(
    Array.isArray(notes) && notes.length === 0,
    `la segunda cuenta ve ${notes?.length} notas y su lista debería llegar vacía`
  );

  const remove = await fetch(`${BASE_URL}/notes/${noteId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${tokenB}` },
  });
  assert(remove.status === 403, `borrar una nota ajena devolvió ${remove.status}, se esperaba 403`);
});

console.log(`\n${passed} aprobadas, ${failed} fallidas`);

if (failed === 0) {
  const code = Buffer.from('aG0yLXFibnY=', 'base64').toString();
  console.log(`\nCódigo de verificación: ${code}`);
}

process.exit(failed > 0 ? 1 : 0);
