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
const user_1 = require("../classes/user");
const database_1 = __importDefault(require("../utils/database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
// Définir le router
const userRoutes = express_1.default.Router();
//Définir les différentes routes
userRoutes.post("/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //Récupérer les données envoyées dans le body de la requête
    const { email, name, password } = req.body;
    try {
        //Crypter le mot de passe
        const encryptedPassword = yield bcrypt_1.default.hash(password, 10);
        //Créer l'utilisateur
        const newUser = new user_1.User(email, name, encryptedPassword);
        // Ajouter l'utilisateur en base de données
        yield database_1.default.user.create({
            data: {
                email: newUser.email.toString(),
                name: newUser.name.toString(),
                password: newUser.password.toString(),
            },
        });
        //Retourner une réponse
        return res.status(201).send(newUser);
    }
    catch (error) {
        //Logger l'erreur
        console.log(error);
        //Conditionné la réponse
        // if (error.code === 11000) {
        //     return res.status(409).send('Email address is already in use.');
        // }
        return res.status(500).send('Erreur lors de l\'enregistrement en base');
    }
}));
userRoutes.delete("/delete", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //Récupérer les données envoyées dans le body de la requête
    const { id } = req.body;
    try {
        // Convertir l'id de l'url en nombre
        const userId = parseInt(id, 10);
        // Vérifier si userId est un nombre valide
        if (isNaN(userId)) {
            return res.status(400).send('L\'ID doit être un nombre valide');
        }
        // Préparer la suppression des commandes par l'id du user supprimé
        const deleteOrders = database_1.default.order.deleteMany({
            where: {
                authorId: userId,
            }
        });
        // Préparer la suppression du user par son id
        const deleteUser = database_1.default.user.delete({
            where: {
                id: userId,
            }
        });
        const transaction = yield database_1.default.$transaction([deleteOrders, deleteUser]);
        if (transaction) {
            //Retourner une réponse
            return res.status(201).send("Utilisateur et commandes supprimés");
        }
        else {
            return res.status(400).send("Utilisateur ou commande non supprimés");
        }
    }
    catch (error) {
        //Logger l'erreur
        console.log(error);
        //Conditionné la réponse
        // if (error.code === 11000) {
        //     return res.status(409).send('Email address is already in use.');
        // }
        res.status(500).send('Error during user registration');
    }
}));
userRoutes.get("/all", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield database_1.default.user.findMany();
        //Retourner une réponse
        return res.status(201).send(users);
    }
    catch (error) {
        //Logger l'erreur
        console.log(error);
        return res.status(500).send('Erreur pendant la récupération dse users');
    }
}));
userRoutes.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //Récupérer les données envoyées dans les paramètres url de la requête
    const { id } = req.params;
    try {
        // Convertir l'id de l'url en nombre
        const userId = parseInt(id, 10);
        // Vérifier si userId est un nombre valide
        if (isNaN(userId)) {
            return res.status(400).send('L\'ID doit être un nombre valide');
        }
        //Rechercher l'user par son id
        const user = yield database_1.default.user.findUnique({
            where: {
                id: userId,
            }
        });
        //Renvoyer l'user
        return res.status(200).send(user);
    }
    catch (e) {
        //Logger l'erreur
        console.log(e);
        //Conditionné la réponse 
        res.status(500).send('Erreur pendant la récupération de l\'user');
    }
}));
userRoutes.post("/update:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //Récupérer les données envoyées dans le body de la requête
    const { id } = req.params;
    try {
        // Convertir l'id de l'url en nombre
        const userId = parseInt(id, 10);
        // Vérifier si userId est un nombre valide
        if (isNaN(userId)) {
            return res.status(400).send('L\'ID doit être un nombre valide');
        }
        //Rechercher l'user par son id
        const user = yield database_1.default.user.findUnique({
            where: {
                id: userId,
            }
        });
        if (user) {
            // Update l'utilisateur en base de données
            const udpatedUser = yield database_1.default.user.update({
                where: {
                    id: user === null || user === void 0 ? void 0 : user.id,
                },
                data: {
                    email: user.email.toString(),
                    name: user.name.toString(),
                    password: user.password.toString(),
                },
            });
            if (udpatedUser) {
                //Retourner une réponse
                return res.status(201).send(udpatedUser);
            }
            else {
                return res.status(400).send("L\'utilisateur n\'a pas pu être mis à jour");
            }
        }
        else {
            return res.status(400).send("L\'utilisateur n\'existe pas encore en base");
        }
    }
    catch (error) {
        //Logger l'erreur
        console.log(error);
        //Conditionné la réponse
        // if (error.code === 11000) {
        //     return res.status(409).send('Email address is already in use.');
        // }
        return res.status(500).send('Erreur lors de l\'enregistrement en base');
    }
}));
exports.default = userRoutes;
