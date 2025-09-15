import { Router } from "express";
import {
  createImage,
  deleteImage,
  getImageById,
  getImagesByDisease,
  getRecentImages,
  getUserImages,
  updateImage,
} from "../controller/modelSavingController";

const router = Router();

//routes
router.post("/image", createImage);
// {
//   "imageUrl": "https://example.com/images/grape_healthy.jpg",
//   "diseaseName": "Grape__healthy",
//   "confidence": 0.95,
//   "treatment": "No treatment needed. Continue regular maintenance and monitoring."
// }
router.get("/image", getUserImages);
router.get("/image/recent", getRecentImages);
router.get("/image/disease/:diseaseName", getImagesByDisease);
router.get("/image/:id", getImageById);
router.put("/image/:id", updateImage);
router.delete("/image/:id", deleteImage);
export default router;
