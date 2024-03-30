import express from "express";

import {
  getUser,
  getUserFriends,
  addRemoveFriends,
} from "../controllers/users.js";

import { verifytoken } from "../middleware/authorization.js";

const router = express.Router();

//READ routes
router.get("/:id", verifytoken, getUser); // '/:id' represents the id of the user
router.get("/:id/friends", verifytoken, getUserFriends);

//UPDATE routes

router.get("/:id/:friendId", verifytoken, addRemoveFriends);

export default router;
