import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { check, printResults, PROJECT_ROOT } from "./utils.js";

async function main() {
  console.log("Lección 04 — Cómo escribir un archivo de prueba con Jest\n");

  const results = [];

  const testFilePath = path.join(PROJECT_ROOT, "__tests__/isValidPost.test.ts");
  const testFileSrc = fs.existsSync(testFilePath)
    ? fs.readFileSync(testFilePath, "utf8")
    : "";

  results.push(
    check(
      "__tests__/isValidPost.test.ts existe",
      fs.existsSync(testFilePath),
      "Crea __tests__/isValidPost.test.ts para tus pruebas.",
    ),
  );

  results.push(
    check(
      "el archivo de prueba importa isValidPost",
      testFileSrc.includes("isValidPost"),
      "Importa isValidPost desde ../src/utils/validate.js al inicio de tu archivo de prueba.",
    ),
  );

  const testCount = (testFileSrc.match(/\btest\s*\(/g) || []).length;
  results.push(
    check(
      "el archivo de prueba tiene al menos 3 pruebas",
      testCount >= 3,
      "Escribe al menos tres pruebas, como se describe en la tarea.",
    ),
  );

  results.push(
    check(
      "se usa expect(isValidPost(...)) en las pruebas",
      /expect\s*\(\s*isValidPost\s*\(/.test(testFileSrc),
      "Llama a isValidPost() dentro de expect(): expect(isValidPost({ title: ..., content: ... })).",
    ),
  );

  results.push(
    check(
      "hay una afirmación .toBe(true)",
      /\.toBe\(\s*true\s*,?\s*\)/.test(testFileSrc),
      "Agrega una prueba en la que isValidPost devuelva true para una entrada válida: expect(...).toBe(true).",
    ),
  );

  results.push(
    check(
      "hay una afirmación .toBe(false)",
      /\.toBe\(\s*false\s*,?\s*\)/.test(testFileSrc),
      "Agrega una prueba en la que isValidPost devuelva false para una entrada inválida: expect(...).toBe(false).",
    ),
  );

  let testError = false;
  if (fs.existsSync(testFilePath)) {
    const result = spawnSync(
      "npm",
      ["test", "--", "--testPathPatterns=isValidPost", "--passWithNoTests"],
      { cwd: PROJECT_ROOT, encoding: "utf8", shell: true },
    );
    testError = result.status !== 0;
  }

  results.push(
    check(
      "npm test pasa para isValidPost",
      !testError,
      "Ejecuta npm test y corrige las pruebas que fallen.",
    ),
  );

  printResults(results, "GRFGF");
}

main().catch((err) => {
  console.log("");
  console.log(`❌ Error del ejecutor de pruebas: ${err.message}`);
  console.log("");
  process.exit(1);
});
