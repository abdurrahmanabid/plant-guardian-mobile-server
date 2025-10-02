import { Router } from "express";
import {
  createSoilPrediction,
  deleteSoilPrediction,
  getSoilPredictionById,
  getUserSoilPredictions,
  updateSoilPrediction,
} from "../controller/soilPredictionController";

const router = Router();

// routes (mounted at /api/soil)
router.post("/", createSoilPrediction);
// {
//   "temperature": 26.5,
//   "phLevel": 6.8,
//   "soilColor": "Dark Brown",
//   "rainfall": 120.0,
//   "nitrogen": 45.2,
//   "phosphorous": 18.7,
//   "potassium": 22.3,
//   "cropType": "Grape",
//   "predictedFertilizer": "NPK 10-26-26",
//   "predictedTreatment": "Apply 50kg/acre split into two doses",
//   "confidence": 0.92
// }
router.get("/", getUserSoilPredictions);
router.get("/:id", getSoilPredictionById);
router.put("/:id", updateSoilPrediction);
router.delete("/:id", deleteSoilPrediction);

export default router;


