import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifytoken } from "../middleware/authorization.js";

const router = express.Router();

// Read posts
router.get("/", verifytoken, getFeedPosts);
router.get("/:userId/posts", verifytoken, getUserPosts);

// Update routes
router.patch(":id/like", verifytoken, likePost);

export default router;
