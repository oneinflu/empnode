const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load env vars immediately
dotenv.config();

const systemUserRoutes = require("./routes/systemUserRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const courseRoutes = require("./routes/courseRoutes");
const skillRoutes = require("./routes/skillRoutes");
const studentProfileRoutes = require("./routes/studentProfileRoutes");
const professionalProfileRoutes = require("./routes/professionalProfileRoutes");
const companyProfileRoutes = require("./routes/companyProfileRoutes");
const mentorProfileRoutes = require("./routes/mentorProfileRoutes");
const mentorRoutes = require("./routes/mentorRoutes");
const jobRoutes = require("./routes/jobRoutes");
const jobApplicationRoutes = require("./routes/jobApplicationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const connectDb = require("./src/db");
const seedAdmin = require("./src/seedAdmin");
const seedInstructor = require("./src/seedInstructor");

const app = express();

app.use(cors({
  origin: "*", // Allow all origins for development
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use("/api/system-users", systemUserRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/student-profiles", studentProfileRoutes);
app.use("/api/professional-profiles", professionalProfileRoutes);
app.use("/api/company-profiles", companyProfileRoutes);
app.use("/api/mentor-profiles", mentorProfileRoutes);
app.use("/api/mentorships", mentorRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/job-applications", jobApplicationRoutes);
app.use("/api/admin", adminRoutes);

const port = process.env.PORT || 5001;

connectDb()
  .then(async () => {
    await seedAdmin();
    await seedInstructor();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server", err);
    process.exit(1);
  });
