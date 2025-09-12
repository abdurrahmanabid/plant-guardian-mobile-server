import { Router } from "express";
import {
  chatCompletion,
  conversation,
  healthCheck,
  test,
} from "../controller/diseaseAndFertilizerExplain";

const router = Router();

//routes
router.post("/gpt-explain", chatCompletion);
router.post("/gpt-conversation", conversation);
router.get("/gpt-health", healthCheck);
router.get("/gpt-test", test);
export default router;
