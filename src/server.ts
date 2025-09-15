import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import userRouter from "./router/UserRouter";
import predictRouter from "./router/PredictedModelRouter";
import gptRoute from "./router/GPTRouter";
import modelRoute from "./router/ModelSaveRouter";

import path from "path";
import cors from "cors";
const app = express();
const PORT = process.env.PORT;
const FRONTEND = process.env.FRONTEND_SITE;
// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  "/static/avatar",
  express.static(path.join(process.cwd(), "uploads/avatar"))
);
app.use(cors({ origin: FRONTEND, credentials: true }));

// api
app.use("/api/user", userRouter);
app.use("/api/predict", predictRouter);
app.use("/api/gpt", gptRoute);
app.use("/api/model", modelRoute);

//server start
app.listen(PORT, () => {
  console.log(`app listen on port 3000`);
});
