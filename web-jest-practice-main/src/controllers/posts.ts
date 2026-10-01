import type { RequestHandler } from "express";
import { slugify } from "../utils/slugify.js";
import { calculateReadTime } from "../utils/readTime.js";
import { truncate } from "../utils/truncate.js";
import { isValidPost } from "../utils/validate.js";

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  summary: string;
  readTime: number;
}

const posts: Post[] = [
  {
    id: 1,
    title: "Primeros pasos con Node.js",
    slug: "primeros-pasos-con-nodejs",
    content:
      "Node.js es un entorno de ejecución de JavaScript construido sobre el motor V8 de Chrome. " +
      "palabra ".repeat(185).trim(),
    summary: "Una introducción a Node.js para quienes desarrollan back end.",
    readTime: 1,
  },
  {
    id: 2,
    title: "Async y await en JavaScript",
    slug: "async-y-await-en-javascript",
    content:
      "Async y await son azúcar sintáctico sobre las promesas de JavaScript. " +
      "palabra ".repeat(189).trim(),
    summary: "Aprende cómo async y await simplifican el JavaScript asíncrono.",
    readTime: 1,
  },
];

let nextId = posts.length + 1;

const getPosts: RequestHandler = (req, res) => {
  const summaries = posts.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    summary: p.summary,
    readTime: p.readTime,
  }));
  res.status(200).json({ success: true, data: summaries, error: null });
};

const getPostById: RequestHandler = (req, res) => {
  const id = Number(req.params["id"]);

  if (Number.isNaN(id)) {
    throw Object.assign(
      new Error(`"${req.params["id"]}" no es un ID de publicación válido`),
      {
        statusCode: 400,
      },
    );
  }

  const post = posts.find((p) => p.id === id) ?? null;

  if (!post) {
    throw Object.assign(
      new Error(`No se encontró la publicación con el ID ${id}`),
      {
        statusCode: 404,
      },
    );
  }

  res.status(200).json({ success: true, data: post, error: null });
};

const createPost: RequestHandler = (req, res) => {
  const body = req.body as { title?: string; content?: string };

  if (!isValidPost({ title: body.title ?? "", content: body.content ?? "" })) {
    throw Object.assign(
      new Error(
        "El título y el contenido son obligatorios y no pueden estar vacíos",
      ),
      { statusCode: 400 },
    );
  }

  const title = body.title as string;
  const content = body.content as string;

  const post: Post = {
    id: nextId++,
    title,
    slug: slugify(title),
    content,
    summary: truncate(content, 120),
    readTime: calculateReadTime(content),
  };

  posts.push(post);
  res.status(201).json({ success: true, data: post, error: null });
};

export { getPosts, getPostById, createPost };
