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
const passport_1 = __importDefault(require("passport"));
const database_1 = __importDefault(require("./utils/database"));
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = require("express-rate-limit");
const api_js_1 = __importDefault(require("./routes/api.js"));
require("dotenv/config");
require("./utils/passport");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const limiter = (0, express_rate_limit_1.rateLimit)({
            windowMs: 15 * 60 * 1000, // 15 minutes
            limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
            standardHeaders: true, // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
            legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
            // store: ... , // Use an external store for consistency across multiple server instances.
        });
        //Définir l'application
        const app = (0, express_1.default)();
        const port = 3000;
        // Apply the rate limiting middleware to all requests.
        app.use(limiter);
        //Initialiser l'utilisation de passport
        app.use(passport_1.default.initialize());
        //Automatiquement parser les body des requêtes entrantes en Json
        app.use(express_1.default.json());
        //Définir les routes
        app.use("/api", api_js_1.default);
        app.get("/protected", passport_1.default.authenticate("jwt", { session: false }), (req, res) => {
            console.log(req.user);
            res.send("Vous êtes bien connecté !");
        });
        //Démarrer le server
        app.listen(port, () => {
            console.log('Server is running');
        });
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield database_1.default.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield database_1.default.$disconnect();
    process.exit(1);
}));
