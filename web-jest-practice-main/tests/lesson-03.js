import fs from "fs";
import path from "path";
import { check, printResults, PROJECT_ROOT } from "./utils.js";

async function main() {
  console.log("Lección 03 — Cómo instalar y configurar Jest\n");

  const results = [];

  const pkg = JSON.parse(
    fs.readFileSync(path.join(PROJECT_ROOT, "package.json"), "utf8"),
  );
  const devDeps = pkg.devDependencies || {};

  results.push(
    check(
      "jest está instalado",
      "jest" in devDeps,
      "Instala jest con: npm install --save-dev jest ts-jest @types/jest",
    ),
  );

  results.push(
    check(
      "ts-jest está instalado",
      "ts-jest" in devDeps,
      "Instala ts-jest con: npm install --save-dev jest ts-jest @types/jest",
    ),
  );

  results.push(
    check(
      "@types/jest está instalado",
      "@types/jest" in devDeps,
      "Instala @types/jest con: npm install --save-dev jest ts-jest @types/jest",
    ),
  );

  results.push(
    check(
      "jest.config.js existe",
      fs.existsSync(path.join(PROJECT_ROOT, "jest.config.js")),
      "Crea jest.config.js en la raíz del proyecto, como se muestra en la lección.",
    ),
  );

  const hasTestScript = pkg.scripts?.test?.includes("jest") ?? false;
  results.push(
    check(
      "package.json tiene un script test que ejecuta jest",
      hasTestScript,
      'Agrega un script "test" a package.json que ejecute jest, como se muestra en la lección.',
    ),
  );

  const tsconfigPath = path.join(PROJECT_ROOT, "tsconfig.json");
  let tsTypes = [];
  if (fs.existsSync(tsconfigPath)) {
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf8"));
    tsTypes = tsconfig.compilerOptions?.types ?? [];
  }
  results.push(
    check(
      'tsconfig.json incluye "jest" y "node" en types',
      tsTypes.includes("jest") && tsTypes.includes("node"),
      'Agrega "types": ["jest", "node"] a compilerOptions en tsconfig.json.',
    ),
  );

  printResults(results, "WRFG");
}

main().catch((err) => {
  console.log("");
  console.log(`❌ Error del ejecutor de pruebas: ${err.message}`);
  console.log("");
  process.exit(1);
});
