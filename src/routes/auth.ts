import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import prisma from "../utils/database";

const router = express.Router();

router.post("/signIn", async function (req, res) {
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

export default router;