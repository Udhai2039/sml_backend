"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
console.log("Loading environment variables...");
dotenv_1.default.config();
// Debugging
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "********" : "Not Set");
const app_1 = __importDefault(require("./app"));
const PORT = parseInt((_a = process.env.PORT) !== null && _a !== void 0 ? _a : '5000', 10);
app_1.default.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
