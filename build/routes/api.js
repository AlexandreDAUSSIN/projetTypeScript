"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("./user"));
const product_1 = __importDefault(require("./product"));
const passport_1 = __importDefault(require("passport"));
//Définir le routeur
const router = express_1.default.Router();
//Définir les différentes routes
router.get("/", (req, res) => {
    res.status(200).send('Bienvenue sur mon API !');
});
router.use("/user", user_1.default);
router.use("/product", passport_1.default.authenticate("jwt", { session: false }), product_1.default);
//Exporter le routeur
exports.default = router;
