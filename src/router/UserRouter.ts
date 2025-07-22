import { Router } from "express";
import { signUpController } from "../controller/signUpController";
import { signInController } from "../controller/signInController";
import { isLoggedIn } from "../middleware/isLoggedIn";
import uploadHandler from '@abdurrahmanabid/multi-file-upload';


const router = Router()

//routes
router.post('/signup',signUpController) // api/user/signup
router.post('/signin',isLoggedIn,signInController) // api/user/signin
router.post("/upload-avatar", uploadHandler("single", [], "uploads/avatars"));


export default router
