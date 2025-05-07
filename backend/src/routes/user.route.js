import express from "express";
import {
  getMyFriends,
  getRecommendedUsers,
  sendfriendsrequest,
  acceptfriendsrequest,
  getFriendRequest,
  getOutgoingFriendRequest,
} from "../controllers/user.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();
router.use(protectRoute);
router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);
router.post("/friends-request/:id", sendfriendsrequest);
router.put("/friends-request/:id/accept", acceptfriendsrequest);
router.get("/friends-requests", getFriendRequest);
router.get("/outgoing-friends-requests", getOutgoingFriendRequest);
export default router;
