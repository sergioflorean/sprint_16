import express from "express";
import router from "./routes/index.js";
import { notFoundHandler, errorHandler } from "./middleware/error.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(router);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
