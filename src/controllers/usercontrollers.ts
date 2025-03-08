import fs from "fs";
import path from "path";
import { Request, Response } from "express";
import { User } from "../types/user";
import nodemailer, { Transporter } from "nodemailer";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const usersFilePath: string = path.join(__dirname, "../data/users.json");

const otpStore: Map<string, { otp: string; expires: number }> = new Map();

const transporter: Transporter = nodemailer.createTransport({
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
  } else {
    console.log("Transporter ready to send emails");
  }
});

// Interface to include counter in the JSON file
interface UserData {
  users: User[];
  lastUserNumber: number;
}

const readUsers = (): { users: User[]; lastUserNumber: number } => {
  try {
    const data: string = fs.readFileSync(usersFilePath, "utf8");
    const parsedData = JSON.parse(data) as UserData;
    return { users: parsedData.users || [], lastUserNumber: parsedData.lastUserNumber || 0 };
  } catch (error) {
    console.error("Error reading users file:", error);
    return { users: [], lastUserNumber: 0 }; // Default if file doesn’t exist
  }
};

const writeUsers = (users: User[], lastUserNumber: number): void => {
  const data: UserData = { users, lastUserNumber };
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(data, null, 2));
    console.log("Users file updated successfully");
  } catch (error) {
    console.error("Error writing to users file:", error);
  }
};

const generateUserId = (lastUserNumber: number): string => {
  const newNumber = lastUserNumber + 1;
  return `SML-USR${newNumber}`;
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  console.log("Received registration data:", req.body);

  const { fullName, email, phone, address, password, gender } = req.body;

  console.log("Password from request:", password); // Debug log

  if (!fullName || !email || !phone || !address || !password || !gender) {
    console.log("Missing required fields");
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  const { users, lastUserNumber } = readUsers();
  const emailExists: boolean = users.some((user) => user.email === email);

  if (emailExists) {
    console.log(`Email already registered: ${email}`);
    res.status(400).json({ message: "Email already registered" });
    return;
  }

  const hashedPassword: string = bcrypt.hashSync(password, 10);
  const newUserId = generateUserId(lastUserNumber);

  const newUser: User = {
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
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "User registered, but failed to send email" });
    return; // Stop if email fails (optional, adjust based on your needs)
  }

  res.status(201).json({ message: "User registered successfully", user: newUser });
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
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

  const isPasswordValid: boolean = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    console.log(`Invalid password for ${email}`);
    res.status(401).json({ message: "Invalid email or password" });
    return;
  }

  res.cookie(
    "session",
    JSON.stringify({ email: user.email, profilePic: user.profilePic }),
    { httpOnly: true }
  );

  console.log(`User logged in: ${email}`);
  res.status(200).json({ message: "Login successful", user });
};

export const getUserProfile = (req: Request, res: Response): void => {
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
    } catch (error) {
      console.error("Error parsing session:", error);
      res.status(400).json({ message: "Invalid session format" });
      return;
    }

    res.status(200).json(parsedSession);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Error fetching user session" });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
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

  const otp: string = crypto.randomInt(100000, 999999).toString();
  const expires: number = Date.now() + 10 * 60 * 1000;

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
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}: ${otp}`);
    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Error sending OTP email:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
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

  const hashedPassword: string = bcrypt.hashSync(newPassword, 10);
  users[userIndex].password = hashedPassword;

  writeUsers(users, lastUserNumber);
  otpStore.delete(email);

  console.log(`Password reset successfully for ${email}`);
  res.status(200).json({ message: "Password reset successfully" });
};

export const getAllUsers = (req: Request, res: Response): void => {
  try {
    const { users } = readUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to retrieve users" });
  }
};
