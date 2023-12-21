import express from "express";
import userRoutes from "./user";
import productRoutes from "./product";
import passport from "passport";

//Définir le routeur
const router = express.Router();

//Définir les différentes routes
router.get("/", (req, res) => {
    res.status(200).send('Bienvenue sur mon API !');
});

router.use("/user", userRoutes);
router.use("/product", passport.authenticate("jwt", { session: false }), productRoutes);

//Exporter le routeur
export default router;