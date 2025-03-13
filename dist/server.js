"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });

const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));

// Load environment variables
console.log("🔄 Loading environment variables...");
dotenv_1.default.config({ path: './.env' });

// Debugging: Check if environment variables are loaded
console.log("✅ EMAIL_USER:", process.env.EMAIL_USER ?? "Not Set");
console.log("✅ EMAIL_PASS:", process.env.EMAIL_PASS ? "********" : "Not Set");

// Set default port to 5000 if not provided
const PORT = parseInt(process.env.PORT ?? '5000', 10);

app_1.default.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
