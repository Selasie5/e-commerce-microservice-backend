import express from "express";
import  {register, login, getProfile} from "../controller/userController";
import { authenticate } from "../../../common/middleware/authMiddleware";
//initializing the router
const router = express.Router();

//Define routes
router.post("/register", register)
router.post("/login",login)

export default  router;