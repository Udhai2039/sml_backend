import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"; // Import cookie-parser
import contactRoutes from "./routes/ContactRoutes";
import bookingRoutes from "./routes/BookingRoutes";
import jobRoutes from "./routes/jobRoutes";
import applicationRoutes from "./routes/applicationRoutes";
import userRoutes from "./routes/userRoutes"; // Import user routes

const app = express();

// Configure CORS
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "https://sml-nexgen.vercel.app",  // Vercel frontend
        "https://www.fechzo.online"  // Custom domain frontend
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies and authentication headers
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders:
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  })
);

app.use(express.json());
app.use(cookieParser());

// Define routes
app.use("/api/contact", contactRoutes);
app.use("/api/book-service", bookingRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/uploads", express.static("uploads")); // Serve uploads directory
app.use("/api/users", userRoutes); // Register and Login routes\

export default app;
