import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { check, printResults, PROJECT_ROOT } from "./utils.js";

async function main() {
  console.log("Lección 02 — Pruebas manuales\n");

  const results = [];

  const testFilePath = path.join(
    PROJECT_ROOT,
    "manual-tests/calculateReadTime.test.ts",
  );
  const testFileSrc = fs.existsSync(testFilePath)
    ? fs.readFileSync(testFilePath, "utf8")
    : "";

  results.push(
    check(
      "manual-tests/calculateReadTime.test.ts existe",
      fs.existsSync(testFilePath),
      "Crea manual-tests/calculateReadTime.test.ts para tus pruebas manuales.",
    ),
  );

  results.push(
    check(
      "el archivo de prueba importa calculateReadTime",
      testFileSrc.includes("calculateReadTime"),
      "Importa calculateReadTime desde ../src/utils/readTime.js al inicio de tu archivo de prueba.",
    ),
  );

  results.push(
    check(
      "el archivo de prueba define una función auxiliar test()",
      testFileSrc.includes("function test("),
      "Define una función auxiliar test() en tu archivo de prueba, como se muestra en la lección.",
    ),
  );

  results.push(
    check(
      "el archivo de prueba define una función auxiliar expect()",
      testFileSrc.includes("function expect("),
      "Define una función auxiliar expect() en tu archivo de prueba, como se muestra en la lección.",
    ),
  );

  // Ejecutamos el archivo de prueba del estudiante y capturamos la salida
  let output = "";
  let runError = false;
  let runCrashed = false;
  if (fs.existsSync(testFilePath)) {
    try {
      output = execSync("npx tsx manual-tests/calculateReadTime.test.ts", {
        cwd: PROJECT_ROOT,
        encoding: "utf8",
        stdio: ["pipe", "pipe", "pipe"],
      });
    } catch (err) {
      output = (err.stdout ?? "") + (err.stderr ?? "");
      runError = true;
      // La salida por stderr indica un fallo real (excepción no capturada, error
      // de importación, etc.) y no un process.exit(1) deliberado por pruebas que
      // fallan. Las líneas con ❌ son fallos de prueba esperados, no un crash.
      const stderr = (err.stderr ?? "")
        .split("\n")
        .filter((line) => !line.includes("❌"))
        .join("\n");
      runCrashed = stderr.trim().length > 0;
    }
  }

  results.push(
    check(
      "el archivo de prueba se ejecuta sin errores",
      fs.existsSync(testFilePath) && !runCrashed,
      "Al ejecutar npx tsx manual-tests/calculateReadTime.test.ts, el archivo debe terminar sin lanzar un error no controlado.",
    ),
  );

  results.push(
    check(
      'la salida incluye: "devuelve 0 para un string vacío"',
      output.includes("devuelve 0 para un string vacío"),
      'Escribe una prueba con la descripción "devuelve 0 para un string vacío".',
    ),
  );

  results.push(
    check(
      'la salida incluye: "devuelve 1 para un texto de 200 palabras"',
      output.includes("devuelve 1 para un texto de 200 palabras"),
      'Escribe una prueba con la descripción "devuelve 1 para un texto de 200 palabras".',
    ),
  );

  results.push(
    check(
      'la salida incluye: "redondea hacia arriba los minutos parciales"',
      output.includes("redondea hacia arriba los minutos parciales"),
      'Escribe una prueba con la descripción "redondea hacia arriba los minutos parciales".',
    ),
  );

  results.push(
    check(
      "todas las pruebas pasan (código de salida 0)",
      fs.existsSync(testFilePath) && !runError,
      "Todas tus pruebas deben pasar. Comprueba que tu función test() cuente los fallos y llame a process.exit(1) si alguna falla, y que calculateReadTime devuelva los valores esperados.",
    ),
  );

  printResults(results, "ZNAHNY");
}

main().catch((err) => {
  console.log("");
  console.log(`❌ Error del ejecutor de pruebas: ${err.message}`);
  console.log("");
  process.exit(1);
});
