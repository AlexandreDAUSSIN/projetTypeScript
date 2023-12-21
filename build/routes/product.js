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
const database_1 = __importDefault(require("../utils/database"));
const product_1 = require("../classes/product");
// Définir le router
const productRoutes = express_1.default.Router();
//Définir les différentes routes
productRoutes.post("/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //Récupérer les données envoyées dans le body de la requête
    const { name, price } = req.body;
    try {
        //Créer le product
        const newProduct = new product_1.Product(name, price);
        // Ajouter le product en base de données
        yield database_1.default.product.create({
            data: {
                name: newProduct.name.toString(),
                price: newProduct.price,
            },
        });
        //Retourner une réponse
        return res.status(201).send(newProduct);
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
productRoutes.delete("/delete", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //Récupérer les données envoyées dans le body de la requête
    const { id } = req.body;
    try {
        // Convertir l'id de l'url en nombre
        const productId = parseInt(id, 10);
        // Vérifier si productId est un nombre valide
        if (isNaN(productId)) {
            return res.status(400).send('L\'ID doit être un nombre valide');
        }
        // Supprimer le product par son id
        yield database_1.default.product.delete({
            where: {
                id: productId,
            }
        });
        //Retourner une réponse
        return res.status(201).send("Produit supprimés");
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
productRoutes.get("/all", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield database_1.default.product.findMany();
        //Retourner une réponse
        return res.status(201).send(products);
    }
    catch (error) {
        //Logger l'erreur
        console.log(error);
        return res.status(500).send('Erreur pendant la récupération dse products');
    }
}));
productRoutes.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //Récupérer les données envoyées dans les paramètres url de la requête
    const { id } = req.params;
    try {
        // Convertir l'id de l'url en nombre
        const productId = parseInt(id, 10);
        // Vérifier si productId est un nombre valide
        if (isNaN(productId)) {
            return res.status(400).send('L\'ID doit être un nombre valide');
        }
        //Rechercher le product par son id
        const product = yield database_1.default.product.findUnique({
            where: {
                id: productId,
            }
        });
        //Renvoyer le product
        return res.status(200).send(product);
    }
    catch (e) {
        //Logger l'erreur
        console.log(e);
        //Conditionné la réponse 
        res.status(500).send('Erreur pendant la récupération du product');
    }
}));
productRoutes.post("/update:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //Récupérer les données envoyées dans le body de la requête
    const { id } = req.params;
    try {
        // Convertir l'id de l'url en nombre
        const productId = parseInt(id, 10);
        // Vérifier si productId est un nombre valide
        if (isNaN(productId)) {
            return res.status(400).send('L\'ID doit être un nombre valide');
        }
        //Rechercher l'user par son id
        const product = yield database_1.default.product.findUnique({
            where: {
                id: productId,
            }
        });
        if (product) {
            // Update l'utilisateur en base de données
            const udpatedProduct = yield database_1.default.product.update({
                where: {
                    id: product === null || product === void 0 ? void 0 : product.id,
                },
                data: {
                    name: product.name.toString(),
                    price: product.price,
                },
            });
            if (udpatedProduct) {
                //Retourner une réponse
                return res.status(201).send(udpatedProduct);
            }
            else {
                return res.status(400).send("Le product n\'a pas pu être mis à jour");
            }
        }
        else {
            return res.status(400).send("Le product n\'existe pas encore en base");
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
exports.default = productRoutes;
