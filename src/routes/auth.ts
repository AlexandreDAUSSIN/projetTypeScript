import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import prisma from "../utils/database";
import { Request, Response } from 'express';
import { validateAuthInputs } from "../utils/middleware";

const router = express.Router();

router.post("/signIn", validateAuthInputs, async function (req: Request, res: Response) {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
        where: {
            email: email,
        }
    });

    if(!user) {
      return res.status(401).json({error: "Invalid mail or password"});
    }

    const isSamePassword = await bcrypt.compare(password, user.password);

    if(!isSamePassword) {
        return res.status(401).json({error: "Invalid mail or password"});
    }

    const token = jwt.sign({ user }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (e) {
    res.json({ error: e });
  }
});

router.post("/signUp", async function (req, res) {
  const { email, password, name, role } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        name: name,
        role: role,
      },
    });

    const token = jwt.sign({ user: newUser }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (e) {
    res.status(500).json({ error: "Internal server error" });
  }
});


export default router;