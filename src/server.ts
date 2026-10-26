import express from "express";
import { catalogRouter } from "./routes/catalog";

const app = express();
app.use(express.json());
app.use(catalogRouter);

app.get("/healthz", (_req, res) => {
  res.status(200).send("ok");
});

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => {
  console.log(`web-bff listening on ${port}`);
});
