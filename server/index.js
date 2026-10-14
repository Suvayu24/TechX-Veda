import "dotenv/config";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 5000;
const serverDirectory = path.dirname(fileURLToPath(import.meta.url));
const clientBuildDirectory = path.resolve(serverDirectory, "../dist");

app.use(cors());
app.use(express.json());

const requiredText = (maxlength) => ({
  type: String,
  required: true,
  trim: true,
  maxlength,
});

const namePattern = /^[A-Za-z]+(?:\s+[A-Za-z]+)*$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phonePattern = /^\d+$/;
const yearOptions = [
  "1st year",
  "2nd year",
  "3rd year",
  "4th year",
  "5th year",
  "Postgraduate",
];
const genderOptions = ["Female", "Male", "Non-binary", "Prefer not to say"];

const withWordLimit = (maxlength, words) => ({
  ...requiredText(maxlength),
  validate: {
    validator: (value) => String(value).trim().split(/\s+/).length <= words,
    message: `Response must be ${words} words or fewer.`,
  },
});

const registrationSchema = new mongoose.Schema(
  {
    fullName: {
      ...requiredText(120),
      validate: {
        validator: (value) => namePattern.test(String(value).trim()),
        message: "Full name can contain letters and spaces only.",
      },
    },
    email: {
      ...requiredText(254),
      lowercase: true,
      validate: {
        validator: (value) => emailPattern.test(String(value).trim()),
        message: "Please enter a valid email address.",
      },
    },
    whatsappNumber: {
      ...requiredText(24),
      validate: {
        validator: (value) => phonePattern.test(String(value)),
        message: "Mobile number can contain digits only.",
      },
    },
    collegeName: requiredText(160),
    programme: requiredText(120),
    branch: requiredText(120),
    year: {
      type: String,
      required: true,
      enum: yearOptions,
    },
    residence: requiredText(160),
    gender: {
      type: String,
      required: true,
      enum: genderOptions,
    },
    introduction: withWordLimit(1800, 200),
    combination: withWordLimit(1400, 150),
    values: withWordLimit(1400, 150),
    contribution: withWordLimit(1400, 150),
    technicalExperience: withWordLimit(1400, 150),
    selectionAcknowledgement: {
      type: Boolean,
      required: true,
      validate: {
        validator: (value) => value === true,
        message: "The selection acknowledgement must be accepted.",
      },
    },
    respectfulParticipation: {
      type: Boolean,
      required: true,
      validate: {
        validator: (value) => value === true,
        message: "The participation declaration must be accepted.",
      },
    },
    informationAccurate: {
      type: Boolean,
      required: true,
      validate: {
        validator: (value) => value === true,
        message: "The accuracy declaration must be accepted.",
      },
    },
    fullCommitment: {
      type: Boolean,
      required: true,
      validate: {
        validator: (value) => value === true,
        message: "The programme commitment must be accepted.",
      },
    },
  },
  { timestamps: true },
);

const Registration = mongoose.model("Registration", registrationSchema);
const normalise = (value) => String(value || "").trim();
const countWords = (value) => normalise(value).match(/\S+/g)?.length || 0;

function validateRegistration(registration) {
  const requiredFields = [
    ["fullName", "full name"],
    ["email", "email address"],
    ["whatsappNumber", "mobile number"],
    ["collegeName", "college"],
    ["programme", "programme"],
    ["branch", "branch"],
    ["year", "year"],
    ["residence", "hostel / residence"],
    ["gender", "gender"],
    ["introduction", "response 01"],
    ["combination", "response 02"],
    ["values", "response 03"],
    ["contribution", "response 04"],
    ["technicalExperience", "response 05"],
  ];
  const missingField = requiredFields.find(([key]) => !registration[key]);
  if (missingField) return `Please complete your ${missingField[1]}.`;
  if (!namePattern.test(registration.fullName)) {
    return "Full name can contain letters and spaces only.";
  }
  if (!emailPattern.test(registration.email)) return "Please enter a valid email address.";
  if (!phonePattern.test(registration.whatsappNumber)) {
    return "Mobile number can contain digits only.";
  }
  if (!yearOptions.includes(registration.year)) return "Please select a valid year.";
  if (!genderOptions.includes(registration.gender)) return "Please select a valid gender.";
  const wordLimits = [
    ["introduction", "01", 200],
    ["combination", "02", 150],
    ["values", "03", 150],
    ["contribution", "04", 150],
    ["technicalExperience", "05", 150],
  ];
  const tooLong = wordLimits.find(([key, , limit]) => countWords(registration[key]) > limit);
  if (tooLong) return `Please shorten response ${tooLong[1]} to ${tooLong[2]} words or fewer.`;
  if (![registration.selectionAcknowledgement, registration.respectfulParticipation, registration.informationAccurate, registration.fullCommitment].every(Boolean)) {
    return "Please accept all four declaration statements.";
  }
  return "";
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, database: mongoose.connection.readyState === 1 });
});

app.post("/api/registrations", async (req, res) => {
  const registration = {
    fullName: normalise(req.body.fullName),
    email: normalise(req.body.email).toLowerCase(),
    whatsappNumber: String(req.body.whatsappNumber || ""),
    collegeName: normalise(req.body.collegeName),
    programme: normalise(req.body.programme),
    branch: normalise(req.body.branch),
    year: normalise(req.body.year),
    residence: normalise(req.body.residence),
    gender: normalise(req.body.gender),
    introduction: normalise(req.body.introduction),
    combination: normalise(req.body.combination),
    values: normalise(req.body.values),
    contribution: normalise(req.body.contribution),
    technicalExperience: normalise(req.body.technicalExperience),
    selectionAcknowledgement: req.body.selectionAcknowledgement === true,
    respectfulParticipation: req.body.respectfulParticipation === true,
    informationAccurate: req.body.informationAccurate === true,
    fullCommitment: req.body.fullCommitment === true,
  };

  const validationMessage = validateRegistration(registration);
  if (validationMessage) {
    return res.status(400).json({
      message: validationMessage,
      code: "VALIDATION_ERROR",
    });
  }
  if (mongoose.connection.readyState !== 1) {
    return res
      .status(503)
      .json({ message: "Registration service is not configured yet." });
  }

  try {
    await Registration.create(registration);
    return res
      .status(201)
      .json({ message: "Registration submitted successfully." });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const firstValidationMessage = Object.values(error.errors)[0]?.message;
      return res
        .status(400)
        .json({ message: firstValidationMessage || "Please check the information you entered." });
    }
    console.error("Registration submission failed", error);
    return res
      .status(500)
      .json({
        message: "Unable to submit your registration. Please try again.",
      });
  }
});

app.use(express.static(clientBuildDirectory));
app.get("/{*splat}", (_req, res) => {
  res.sendFile(path.join(clientBuildDirectory, "index.html"));
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

app.listen(port, "0.0.0.0", () =>
  console.log(`TechX Veda service listening on ${port}`),
);
