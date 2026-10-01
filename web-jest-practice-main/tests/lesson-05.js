import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { check, printResults, PROJECT_ROOT } from "./utils.js";

async function main() {
  console.log("Lección 05 — Cómo probar los casos límite\n");

  const results = [];

  const testFilePath = path.join(PROJECT_ROOT, "__tests__/isValidPost.test.ts");
  const testFileSrc = fs.existsSync(testFilePath)
    ? fs.readFileSync(testFilePath, "utf8")
    : "";

  results.push(
    check(
      "__tests__/isValidPost.test.ts existe",
      fs.existsSync(testFilePath),
      "Crea __tests__/isValidPost.test.ts (completa primero la lección 04).",
    ),
  );

  const testCount = (testFileSrc.match(/\btest\s*\(/g) || []).length;
  results.push(
    check(
      "el archivo de prueba tiene al menos 5 pruebas",
      testCount >= 5,
      "Agrega al menos dos pruebas de casos límite (título y contenido con solo espacios) a tu archivo isValidPost.test.ts.",
    ),
  );

  const falseCount = (testFileSrc.match(/\.toBe\(\s*false\s*,?\s*\)/g) || [])
    .length;
  results.push(
    check(
      "hay al menos 4 afirmaciones .toBe(false)",
      falseCount >= 4,
      "Agrega pruebas de casos límite para un título con solo espacios y un contenido con solo espacios: las dos deben devolver false.",
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
      "todas las pruebas pasan",
      !testError,
      "Ejecuta npm test y corrige las pruebas que fallen.",
    ),
  );

  printResults(results, "RQTRF");
}

main().catch((err) => {
  console.log("");
  console.log(`❌ Error del ejecutor de pruebas: ${err.message}`);
  console.log("");
  process.exit(1);
});
