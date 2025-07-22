import { Router } from "express";
import { signUpController } from "../controller/signUpController";

const router = Router()

//routes
router.post('/signup',signUpController) // api/user/signup

export default router
