//app.ts
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"; // Import cookie-parser
import contactRoutes from "./routes/ContactRoutes";
import bookingRoutes from "./routes/BookingRoutes";
import jobRoutes from "./routes/jobRoutes";
import applicationRoutes from "./routes/applicationRoutes";
import userRoutes from "./routes/userRoutes"; // Import user routes
//import { getUserProfile } from "./controllers/usercontrollers";

const app = express();

// Add this to app.ts before you use the routers
app.get('/api/test', (req, res) => {
  res.status(200).json({ message: 'API is working' });
});

// Configure CORS
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:3000",
        "http://192.168.0.197:3000",
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
