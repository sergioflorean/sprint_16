import { slugify } from "../src/utils/slugify.js";

let failures = 0;

function test(description: string, fn: () => void): void {
  try {
    fn();
    console.log(`✅ ${description}`);
  } catch (err) {
    console.error(`❌ ${description}: ${(err as Error).message}`);
    failures++;
  }
}

function expect(actual: unknown) {
  return {
    toBe(expected: unknown) {
      if (actual !== expected) {
        throw new Error(
          `Se esperaba ${String(expected)}, se obtuvo ${String(actual)}`,
        );
      }
    },
  };
}

test("convierte los espacios en guiones", () => {
  expect(slugify("Hola Mundo")).toBe("hola-mundo");
});

test("convierte el título a minúsculas", () => {
  expect(slugify("Mi Nota")).toBe("mi-nota");
});

test("elimina los caracteres especiales", () => {
  expect(slugify("Mi Nota!")).toBe("mi-nota");
});

test("devuelve un string vacío cuando la entrada está vacía", () => {
  expect(slugify("")).toBe("");
});

process.exit(failures > 0 ? 1 : 0);
