import express from "express";
import userRoutes from "./user";
import productRoutes from "./product";
import authRoutes from "./auth";
import passport from "passport";
import orderRoutes from "./order";

//Définir le routeur
const router = express.Router();

//Définir les différentes routes
router.get("/", (req, res) => {
    res.status(200).send('Bienvenue sur mon API !');
});

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/product", productRoutes);
router.use("/order", passport.authenticate("jwt", { session: false }), orderRoutes);

//Exporter le routeur
export default router;