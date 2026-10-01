import { isValidPost } from "../src/utils/validate.js";

test("devuelve true cuando título y contenido tienen texto", () => {
  expect(
    isValidPost({
      title: "Mi publicación",
      content: "Contenido de prueba",
    })
  ).toBe(true);
});

test("devuelve false cuando el título está vacío", () => {
  expect(
    isValidPost({
      title: "",
      content: "Contenido de prueba",
    })
  ).toBe(false);
});

test("devuelve false cuando el contenido está vacío", () => {
  expect(
    isValidPost({
      title: "Mi publicación",
      content: "",
    })
  ).toBe(false);
});

test("devuelve false cuando el título contiene solo espacios", () => {
  expect(
    isValidPost({
      title: " ",
      content: "Contenido válido",
    })
  ).toBe(false);
});

test("devuelve false cuando el contenido contiene solo espacios", () => {
  expect(
    isValidPost({
      title: "Título válido",
      content: " ",
    })
  ).toBe(false);
});