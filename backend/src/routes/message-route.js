import express from "express";
import { protectRoute } from "../middleware/auth-middleware.js";
import {
  getMessages,
  getUserForSidebar,
  sendMessage,
} from "../controllers/message-controller.js";
import { createGroup, getGroupsForSidebar , getGroupMessages, sendGroupMessages } from "../controllers/group-message-controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUserForSidebar);
router.get("/get-messages/:id", protectRoute, getMessages);

router.get("/groups", protectRoute, getGroupsForSidebar);
router.post("/create-group", protectRoute, createGroup);
router.get("/get-group-messages/:id", protectRoute, getGroupMessages);

router.post("/send/:id", protectRoute, sendMessage);
router.post("/send-group-messages/:id", protectRoute, sendGroupMessages);
export default router;
