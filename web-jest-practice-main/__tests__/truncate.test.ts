import { truncate } from "../src/utils/truncate.js";

test("devuelve el texto sin cambios cuando cabe en el límite", () => {
  expect(truncate("Texto corto", 20)).toBe("Texto corto");
});

test("recorta el texto largo y agrega puntos suspensivos", () => {
  expect(truncate("Un resumen de publicación muy largo", 10)).toBe("Un resumen...");
});

test("devuelve un string vacío cuando la entrada está vacía", () => {
  expect(truncate("", 10)).toBe("");
});

test("devuelve el texto sin cambios cuando su longitud es igual a maxLength", () => {
  expect(truncate("Hola", 4)).toBe("Hola");
});

test("recorta el texto cuando su longitud supera maxLength por un carácter", () => {
  expect(truncate("Hola!", 4)).toBe("Hola...");
});