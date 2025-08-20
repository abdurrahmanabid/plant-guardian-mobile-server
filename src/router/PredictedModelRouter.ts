import { Router } from "express";
import uploadHandler from "@abdurrahmanabid/multi-file-upload";
import { diseasePredictionController } from "../controller/diseasePredictionController";


const router = Router();

//routes
router.post('/image-predict',diseasePredictionController)
router.post(
  "/leaf-upload",
  uploadHandler("single", ["image/jpeg", "image/png"], "uploads/leaf"),
); // api/predict/leaf-upload
export default router;
