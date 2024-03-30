import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer"; //middleware used for handling multipart/form-data.
import helmet from "helmet"; //helmet-package => helps to secure express.
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { error } from "console";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/post.js";
import { register } from "./controllers/auth.js";
import { verifytoken } from "./middleware/authorization.js";
import { createPost } from "./controllers/posts.js";
import { users, posts } from "./data/index.js";
import User from "./models/User.js";
import Post from "./models/Posts.js";

// CONFIGURATIONS

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assests", express.static(path.join(__dirname, "public/assets")));

//file storage configurations
//way to save the file in our website
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

//routes
app.post("./auth/register", upload.single("picture"), register);
app.post("/post", verifytoken, upload.single("picture"), createPost);

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/post", postRoutes);

// MOONGOOSE SETUP
const PORT = process.env.PORT || 6000;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

    // ADD dummy data
    // User.insertMany(users);
    // Post.insertMany(posts)
  })
  .catch((error) => {
    console.log(`${error} did not connect`);
  });
