import "dotenv/config";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const registrationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    whatsappNumber: { type: String, required: true, trim: true, maxlength: 24 },
    gender: {
      type: String,
      required: true,
      enum: ["Female", "Male", "Non-binary", "Prefer not to say"],
    },
    enrollmentNumber: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
  },
  { timestamps: true },
);

const Registration = mongoose.model("Registration", registrationSchema);
const normalise = (value) => String(value || "").trim();

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, database: mongoose.connection.readyState === 1 });
});

app.post("/api/registrations", async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res
      .status(503)
      .json({ message: "Registration service is not configured yet." });
  }

  const registration = {
    name: normalise(req.body.name),
    email: normalise(req.body.email).toLowerCase(),
    whatsappNumber: normalise(req.body.whatsappNumber),
    gender: normalise(req.body.gender),
    enrollmentNumber: normalise(req.body.enrollmentNumber),
  };

  if (Object.values(registration).some((value) => !value)) {
    return res
      .status(400)
      .json({ message: "Please complete every required field." });
  }
  if (!/^\S+@\S+\.\S+$/.test(registration.email)) {
    return res
      .status(400)
      .json({ message: "Please enter a valid email address." });
  }
  if (!/^[0-9+() -]{10,20}$/.test(registration.whatsappNumber)) {
    return res
      .status(400)
      .json({ message: "Please enter a valid WhatsApp number." });
  }

  try {
    await Registration.create(registration);
    return res
      .status(201)
      .json({ message: "Registration submitted successfully." });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res
        .status(400)
        .json({ message: "Please check the information you entered." });
    }
    console.error("Registration submission failed", error);
    return res
      .status(500)
      .json({
        message: "Unable to submit your registration. Please try again.",
      });
  }
});

const databaseUrl = process.env.MONGODB_URI;
if (!databaseUrl) {
  console.warn(
    "MONGODB_URI is not set. Registration submissions will be unavailable.",
  );
} else {
  mongoose
    .connect(databaseUrl)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("MongoDB connection failed", error));
}

app.listen(port, () => console.log(`TechX Veda API listening on ${port}`));
