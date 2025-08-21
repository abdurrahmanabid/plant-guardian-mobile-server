import { Router } from "express";
import { signUpController } from "../controller/signUpController";
import { signInController } from "../controller/signInController";
import { isLoggedIn } from "../middleware/isLoggedIn";
import uploadHandler from "@abdurrahmanabid/multi-file-upload";
import { getUser } from "../controller/getUser";

const router = Router();

//routes
router.post("/signup", signUpController); // api/user/signup
router.post("/signin", signInController); // api/user/signin
router.post(
  "/upload-avatar",
  uploadHandler("single", ["image/jpeg", "image/png"], "uploads/avatars")
); // api/user/upload-avatar
router.get("/get-user", isLoggedIn, getUser); // api/user/get-user

export default router;
