import { Router } from "express";
import {
  createSoilModel,
  deleteSoilModel,
  getSoilModelById,
  getUserSoilModels,
  updateSoilModel,
} from "../controller/soilModelController";

const router = Router();

// routes (mounted at /api/soil-and-image-model)
router.post("/save", createSoilModel);
// {
//   "temperature": 26.5,
//   "phLevel": 6.8,
//   "soilColor": "Black",
//   "rainfall": 100,
//   "nitrogen": 40,
//   "phosphorous": 18,
//   "potassium": 20,
//   "cropType": "Grape",
//   "diseaseDetected": "Grape__healthy",
//   "imageUrl": "https://example.com/images/grape_healthy.jpg",
//   "recommendedFertilizer": "SSP",
//   "treatmentSuggestion": "No treatment needed"
// }
router.get("/saved", getUserSoilModels);
router.get("/saved/:id", getSoilModelById);
router.put("/saved/:id", updateSoilModel);
router.delete("/saved/:id", deleteSoilModel);

export default router;


