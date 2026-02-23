import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

/* ========================
   MongoDB Connection
======================== */

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    isConnected = db.connections[0].readyState;
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.log("MongoDB Error ❌", error);
  }
};

await connectDB();

/* ========================
   User Schema
======================== */

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);

/* ========================
   Routes
======================== */

// Root
app.get("/", (req, res) => {
  res.json({ message: "Backend Running on Vercel 🚀" });
});

// Register
app.post("/api/users/register", async (req, res) => {
  try {
    await connectDB();

    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "Registered Successfully ✅",
      user
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error ❌" });
  }
});

// Login
app.post("/api/users/login", async (req, res) => {
  try {
    await connectDB();

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid Email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    res.json({
      message: "Login Successful ✅",
      user
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error ❌" });
  }
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Route Not Found ❌" });
});

export default app;