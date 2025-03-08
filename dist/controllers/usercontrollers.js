"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.getUserProfile = exports.loginUser = exports.registerUser = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const usersFilePath = path_1.default.join(__dirname, "../data/users.json");
const otpStore = new Map();
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
console.log("Controller starting, email config:", process.env.EMAIL_USER, process.env.EMAIL_PASS);
transporter.verify((error, success) => {
    if (error) {
        console.error("Transporter verification failed:", error);
    }
    else {
        console.log("Transporter ready to send emails");
    }
});
const readUsers = () => {
    try {
        const data = fs_1.default.readFileSync(usersFilePath, "utf8");
        const parsedData = JSON.parse(data);
        return { users: parsedData.users || [], lastUserNumber: parsedData.lastUserNumber || 0 };
    }
    catch (error) {
        console.error("Error reading users file:", error);
        return { users: [], lastUserNumber: 0 }; // Default if file doesn’t exist
    }
};
const writeUsers = (users, lastUserNumber) => {
    const data = { users, lastUserNumber };
    try {
        fs_1.default.writeFileSync(usersFilePath, JSON.stringify(data, null, 2));
        console.log("Users file updated successfully");
    }
    catch (error) {
        console.error("Error writing to users file:", error);
    }
};
const generateUserId = (lastUserNumber) => {
    const newNumber = lastUserNumber + 1;
    return `SML-USR${newNumber}`;
};
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Received registration data:", req.body);
    const { fullName, email, phone, address, password, gender } = req.body;
    console.log("Password from request:", password); // Debug log
    if (!fullName || !email || !phone || !address || !password || !gender) {
        console.log("Missing required fields");
        res.status(400).json({ message: "All fields are required" });
        return;
    }
    const { users, lastUserNumber } = readUsers();
    const emailExists = users.some((user) => user.email === email);
    if (emailExists) {
        console.log(`Email already registered: ${email}`);
        res.status(400).json({ message: "Email already registered" });
        return;
    }
    const hashedPassword = bcryptjs_1.default.hashSync(password, 10);
    const newUserId = generateUserId(lastUserNumber);
    const newUser = {
        id: newUserId,
        fullName,
        email,
        phone,
        address,
        password: hashedPassword,
        gender,
        profilePic: req.file ? `/uploads/${req.file.filename}` : "",
    };
    users.push(newUser);
    writeUsers(users, lastUserNumber + 1);
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Welcome! Your Registration Details",
        text: `
      Hello ${fullName},

      Congratulations on successfully registering! Here are your account details:

      User ID: ${newUserId}
      Email: ${email}
      Password: ${password}

      Please keep this information safe. You can log in using your email and password.

      Best regards,
      Your App Team
    `,
    };
    console.log("Email content to be sent:", mailOptions); // Debug log
    try {
        yield transporter.sendMail(mailOptions);
        console.log(`Email sent to ${email}`);
    }
    catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "User registered, but failed to send email" });
        return; // Stop if email fails (optional, adjust based on your needs)
    }
    res.status(201).json({ message: "User registered successfully", user: newUser });
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Login attempt:", req.body);
    const { email, password } = req.body;
    if (!email || !password) {
        console.log("Missing email or password");
        res.status(400).json({ message: "Email and password are required" });
        return;
    }
    const { users } = readUsers();
    const user = users.find((u) => u.email === email);
    if (!user) {
        console.log(`User not found: ${email}`);
        res.status(401).json({ message: "Invalid email or password" });
        return;
    }
    const isPasswordValid = bcryptjs_1.default.compareSync(password, user.password);
    if (!isPasswordValid) {
        console.log(`Invalid password for ${email}`);
        res.status(401).json({ message: "Invalid email or password" });
        return;
    }
    res.cookie("session", JSON.stringify({ email: user.email, profilePic: user.profilePic }), { httpOnly: true });
    console.log(`User logged in: ${email}`);
    res.status(200).json({ message: "Login successful", user });
});
exports.loginUser = loginUser;
const getUserProfile = (req, res) => {
    try {
        const session = req.cookies.session;
        if (!session) {
            console.log("No session cookie found");
            res.status(401).json({ message: "Not logged in" });
            return;
        }
        let parsedSession;
        try {
            parsedSession = JSON.parse(session);
            console.log("Session parsed:", parsedSession);
        }
        catch (error) {
            console.error("Error parsing session:", error);
            res.status(400).json({ message: "Invalid session format" });
            return;
        }
        res.status(200).json(parsedSession);
    }
    catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Error fetching user session" });
    }
};
exports.getUserProfile = getUserProfile;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Forgot password request:", req.body);
    const { email } = req.body;
    if (!email) {
        console.log("Missing email for forgot password");
        res.status(400).json({ message: "Email is required" });
        return;
    }
    const { users } = readUsers();
    const user = users.find((u) => u.email === email);
    if (!user) {
        console.log(`No user found with email: ${email}`);
        res.status(404).json({ message: "Email not registered" });
        return;
    }
    const otp = crypto_1.default.randomInt(100000, 999999).toString();
    const expires = Date.now() + 10 * 60 * 1000;
    otpStore.set(email, { otp, expires });
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset OTP",
        text: `
      Hello ${user.fullName},

      You requested a password reset. Here is your OTP:

      OTP: ${otp}

      This OTP is valid for 10 minutes. Use it to reset your password.

      If you didn’t request this, please ignore this email.

      Best regards,
      Your App Team
    `,
    };
    console.log("Sending OTP email to:", email);
    try {
        yield transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${email}: ${otp}`);
        res.status(200).json({ message: "OTP sent to your email" });
    }
    catch (error) {
        console.error("Error sending OTP email:", error);
        res.status(500).json({ message: "Failed to send OTP" });
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Reset password request:", req.body);
    const { email, otp, newPassword, confirmPassword } = req.body;
    if (!email || !otp || !newPassword || !confirmPassword) {
        console.log("Missing fields for reset password");
        res.status(400).json({ message: "Email, OTP, new password, and confirm password are required" });
        return;
    }
    if (newPassword !== confirmPassword) {
        console.log("Passwords do not match");
        res.status(400).json({ message: "New password and confirm password do not match" });
        return;
    }
    const storedOtp = otpStore.get(email);
    if (!storedOtp || storedOtp.otp !== otp || Date.now() > storedOtp.expires) {
        console.log(`Invalid or expired OTP for ${email}: ${otp}`);
        res.status(400).json({ message: "Invalid or expired OTP" });
        return;
    }
    const { users, lastUserNumber } = readUsers();
    const userIndex = users.findIndex((u) => u.email === email);
    if (userIndex === -1) {
        console.log(`User not found during reset: ${email}`);
        res.status(404).json({ message: "User not found" });
        return;
    }
    const hashedPassword = bcryptjs_1.default.hashSync(newPassword, 10);
    users[userIndex].password = hashedPassword;
    writeUsers(users, lastUserNumber);
    otpStore.delete(email);
    console.log(`Password reset successfully for ${email}`);
    res.status(200).json({ message: "Password reset successfully" });
});
exports.resetPassword = resetPassword;
