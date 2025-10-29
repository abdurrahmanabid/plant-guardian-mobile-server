import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import userRouter from "./router/UserRouter";
import predictRouter from "./router/PredictedModelRouter";
import gptRoute from "./router/GPTRouter";
import modelRoute from "./router/ModelSaveRouter";
import soilPredictionRoute from "./router/SoilModel";
import soilModelRoute from "./router/SoilAndImageModelRouter";

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
app.use(
  "/static/leaf",
  express.static(path.join(process.cwd(), "uploads/leaf"))
);
app.use(cors({ origin: true, credentials: true }));

// api
app.use("/api/user", userRouter);
app.use("/api/predict", predictRouter);
app.use("/api/gpt", gptRoute);
app.use("/api/model", modelRoute);
app.use("/api/soil-model", soilPredictionRoute);
app.use("/api/soil-and-image-model", soilModelRoute);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

//server start
app.listen(PORT || 3000, () => {
  console.log(`Server running on port ${PORT || 3000}`);
});
