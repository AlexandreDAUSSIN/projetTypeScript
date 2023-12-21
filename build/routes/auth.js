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
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = __importDefault(require("../utils/database"));
const router = express_1.default.Router();
router.post("/signIn", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        try {
            const user = yield database_1.default.user.findUnique({
                where: {
                    email: email,
                }
            });
            if (!user) {
                return res.status(401).json({ error: "Invalid mail or password" });
            }
            const isSamePassword = yield bcrypt_1.default.compare(password, user.password);
            if (!isSamePassword) {
                return res.status(401).json({ error: "Invalid mail or password" });
            }
            const token = jsonwebtoken_1.default.sign({ user }, process.env.JWT_SECRET, {
                expiresIn: "1h",
            });
            res.json({ token });
        }
        catch (e) {
            res.json({ error: e });
        }
    });
});
exports.default = router;
