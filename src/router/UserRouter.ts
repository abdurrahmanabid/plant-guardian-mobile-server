import { Router } from "express";
import { signUpController } from "../controller/signUpController";
import { signInController } from "../controller/signInController";
import { isLoggedIn } from "../middleware/isLoggedIn";

const router = Router()

//routes
router.post('/signup',signUpController) // api/user/signup
router.post('/signin',isLoggedIn,signInController) // api/user/signin

export default router
