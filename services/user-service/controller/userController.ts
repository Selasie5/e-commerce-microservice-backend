import { Request, Response } from "express";
import prisma from "../../../common/db.ts";
import bcrypt from "bcrypt";
import { redisClient } from "../server.ts"
import jsonwebtoken from "jsonwebtoken";



const JWT_SECRET = process.env.JWT_SECRET || "default-secret";
interface AuthenticatedRequest extends Request {
    userId?: number;
  }
// Handle user registration
export const register = async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
      },
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ error: "Internal server error", details: error });
  }
};

// Handle user login
export const login = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jsonwebtoken.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error", details: error });
  }
};

// Logout User
export const logout = async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({ message: "Token not provided" });
    }
  
    const token = authHeader.split(" ")[1];
  
    try {
      const decoded = jsonwebtoken.decode(token) as { exp?: number };
  
      if (!decoded || !decoded.exp) {
        return res.status(400).json({ message: "Invalid token" });
      }
  
      const ttl = decoded.exp - Math.floor(Date.now() / 1000); // Time-to-live in seconds
  
      if (ttl <= 0) {
        return res.status(400).json({ message: "Token has already expired" });
      }
  
      // Blacklist the token in Redis with the TTL
      await redisClient.set(`blacklist:${token}`, "blacklisted", { EX: ttl });
  
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ message: "Internal server error", details: error });
    }
  };

//Get user profile
export const getProfile = async (req:any, res:any) => {
  try {
    const userId = req.userId; // Access the userId property

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: Missing user ID" });
    }

    // Replace this with your actual database call
    const user = await prisma.user.findUnique({
        where: { id: userId },
      });
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ profile: user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
