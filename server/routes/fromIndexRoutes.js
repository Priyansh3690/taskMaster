import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import {
    redirectTOIndex,
    redirectTOsignup,
    registerUser,
    sendOTP,
    checkOTP,
    logout,
    checkSession,
    getUserName
} from "../controller/taskController.js";
import { authenticate } from "../middleware/checkToken.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get('/', redirectTOIndex);
router.get('/signup', redirectTOsignup);
router.get('/check-session', authenticate, checkSession);

router.post('/register', registerUser);
router.post('/sendOTP', sendOTP);
router.post('/checkOTP', checkOTP);
router.post('/logout', logout);
router.post('/getUserName', getUserName);

export default router;