import { Router } from "express";
import uploadHandler from "@abdurrahmanabid/multi-file-upload";
import { diseasePredictionController } from "../controller/diseasePredictionController";
import { fertilizerAndTreatmentPredictionController } from "../controller/fertilizerAndTreatmentPrediction";
import { fertilizerPredictionController } from "../controller/fertilizerPredictionController";
import { deleteImageController } from "../controller/deleteImageController";

const router = Router();

//routes
router.post("/image-predict", diseasePredictionController);
router.post(
  "/predict-fertilizer-and-treatment",
  fertilizerAndTreatmentPredictionController
);
router.post("/predict-fertilizer", fertilizerPredictionController);
router.post(
  "/leaf-upload",
  uploadHandler("single", ["image/jpeg", "image/png"], "uploads/leaf")
); // api/predict/leaf-upload
router.delete("/delete-image", deleteImageController); // body: { imageUrl }
export default router;
