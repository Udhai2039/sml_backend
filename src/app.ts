// app.ts
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import contactRoutes from "./routes/ContactRoutes";
import bookingRoutes from "./routes/BookingRoutes";
import jobRoutes from "./routes/jobRoutes";
import applicationRoutes from "./routes/applicationRoutes";
import userRoutes from "./routes/userRoutes";
import jobAlertRoutes from "./routes/jobAlertRoutes";

const app = express();

// Test endpoint for debugging
app.get('/api/test', (req, res) => {
    res.status(200).json({ message: 'API is working' });
});

// Configure CORS
app.use(
    cors({
        origin: (origin, callback) => {
            const allowedOrigins = [
                "http://localhost:3000",
                "https://sml-nexgen-git-master-udhais-projects.vercel.app",
                "https://sml-nexgen-n63mrtung-udhais-projects.vercel.app",
                "https://www.smlnexgenllp.com",
                "www.smlnexgenllp.com",
            ];
            
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                console.error(`CORS blocked: ${origin}`);
                callback(null, false);  // Instead of throwing an error, return `false`
            }
        },
        credentials: true,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    })
);


// Middleware
app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static("uploads"));

app.use("/api/contact", contactRoutes);
app.use("/api/book-service", bookingRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/job-alerts", jobAlertRoutes);

export default app;
