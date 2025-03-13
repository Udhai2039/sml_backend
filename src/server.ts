import dotenv from 'dotenv';
import app from './app';

// Load environment variables
console.log("🔄 Loading environment variables...");
dotenv.config({ path: './.env' });

// Debugging: Check if environment variables are loaded
console.log("✅ EMAIL_USER:", process.env.EMAIL_USER ?? "Not Set");
console.log("✅ EMAIL_PASS:", process.env.EMAIL_PASS ? "********" : "Not Set");

// Set default port to 5000 if not provided
const PORT: number = parseInt(process.env.PORT ?? '5000', 10);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
