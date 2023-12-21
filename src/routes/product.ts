import express from "express";
import prisma from "../utils/database";
import { Product } from "../classes/product";

// Définir le router
const productRoutes = express.Router();

//Définir les différentes routes
productRoutes.post("/add", async (req, res) => {
    //Récupérer les données envoyées dans le body de la requête
    const { name, price } = req.body;

    try {

        //Créer le product
        const newProduct = new Product(name, price);

        // Ajouter le product en base de données
        await prisma.product.create({
            data: {
              name: newProduct.name.toString(),
              price: newProduct.price,
            },
          });

        //Retourner une réponse
        return res.status(201).send(newProduct);

    } catch (error) {

        //Logger l'erreur
        console.log(error);

        //Conditionné la réponse
        // if (error.code === 11000) {
        //     return res.status(409).send('Email address is already in use.');
        // }

        return res.status(500).send('Erreur lors de l\'enregistrement en base');

    }
});

productRoutes.delete("/delete", async (req, res) => {
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
        await prisma.product.delete({
            where: {
                id: productId,
            }
        });

        //Retourner une réponse
        return res.status(201).send("Produit supprimés");

    } catch (error) {

        //Logger l'erreur
        console.log(error);

        //Conditionné la réponse
        // if (error.code === 11000) {
        //     return res.status(409).send('Email address is already in use.');
        // }

        res.status(500).send('Error during user registration');

    }
});

productRoutes.get("/all", async (req, res) => {

    try {

        const products = await prisma.product.findMany();

        //Retourner une réponse
        return res.status(201).send(products);

    } catch (error) {

        //Logger l'erreur
        console.log(error);

        return res.status(500).send('Erreur pendant la récupération dse products');

    }
});

productRoutes.get("/:id", async (req, res) => {
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
        const product = await prisma.product.findUnique({
            where: {
                id: productId,
            }
        });

        //Renvoyer le product
        return res.status(200).send(product);

    } catch (e) {

        //Logger l'erreur
        console.log(e);

        //Conditionné la réponse 
        res.status(500).send('Erreur pendant la récupération du product');

    }

});

productRoutes.post("/update:id", async (req, res) => {
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
        const product = await prisma.product.findUnique({
            where: {
                id: productId,
            }
        });

        if (product) {
            // Update l'utilisateur en base de données
            const udpatedProduct = await prisma.product.update({
                where: {
                    id: product?.id,
                },
                data: {
                name: product.name.toString(),
                price: product.price,
                },
            });

            if(udpatedProduct) {
                //Retourner une réponse
                return res.status(201).send(udpatedProduct);
            } else {
                return res.status(400).send("Le product n\'a pas pu être mis à jour");
            }
        } else {
            return res.status(400).send("Le product n\'existe pas encore en base");
        }

    } catch (error) {

        //Logger l'erreur
        console.log(error);

        //Conditionné la réponse
        // if (error.code === 11000) {
        //     return res.status(409).send('Email address is already in use.');
        // }

        return res.status(500).send('Erreur lors de l\'enregistrement en base');

    }
});

export default productRoutes;