import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ========================
// MongoDB Connection
// ========================
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

// ========================
// User Schema
// ========================
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

// ========================
// Routes
// ========================

// Root
app.get("/", (req, res) => {
  res.json({ message: "Backend Running 🚀" });
});

// Register
app.post("/api/users/register", async (req, res) => {
  try {
    await connectDB();
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields ❌" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists ❌" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: "Registered Successfully ✅", user });
  } catch (error) {
    res.status(500).json({ message: "Server Error ❌" });
  }
});

// Login
app.post("/api/users/login", async (req, res) => {
  console.log("Login Body:", req.body); // ✅ check what's sent

  try {
    await connectDB();
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("Missing email or password");
      return res.status(400).json({ message: "Please fill all fields ❌" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(400).json({ message: "Invalid Email ❌" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch");
      return res.status(400).json({ message: "Invalid Password ❌" });
    }

    console.log("Login success:", user.email);
    res.json({ message: "Login Successful ✅", user });
  } catch (error) {
    console.error("Login Error:", error); // 🔹 see full error in console
    res.status(500).json({ message: "Server Error ❌" });
  }
});

// ========================
// Local testing (optional)
// ========================
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
}

export default app;