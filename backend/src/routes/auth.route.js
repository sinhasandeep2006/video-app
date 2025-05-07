import express  from 'express';
import { login, logout, signup,onboard,me } from './../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
const router =express.Router()
router.post("/signup",signup)
router.post("/login",login)

router.post("/logout",logout)
router.post("/Onboarding",protectRoute,onboard)


router.get("/me",protectRoute,me)
export default  router
