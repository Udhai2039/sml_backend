import dotenv from 'dotenv';

// Load environment variables
console.log("Loading environment variables...");
dotenv.config();

// Debugging
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "********" : "Not Set");

import app from './app';

const PORT: number = parseInt(process.env.PORT ?? '5000', 10);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
