import express from "express";
import prisma from "../utils/database";
import { Order } from "../classes/order";
import { OrderProduct } from "@prisma/client";

// Définir le router
const orderRoutes = express.Router();

//Définir les différentes routes
orderRoutes.post("/add", async (req, res) => {
    //Récupérer les données envoyées dans le body de la requête
    const { authorId } = req.body;

    try {

        // Ajouter l'order en base de données
        const newOrder = await prisma.order.create({
            data: {
                authorId: authorId
            },
        });

        //Retourner une réponse
        return res.status(201).send(newOrder);

    } catch (error: any) {

        //Logger l'erreur
        console.log(error);

        return res.status(500).send('Erreur lors de l\'enregistrement en base');

    }
});

orderRoutes.delete("/delete/:id", async (req, res) => {
    //Récupérer les données envoyées dans le body de la requête
    const { id } = req.params;

    try {

        // Convertir l'id de l'url en nombre
        const orderId = parseInt(id, 10);

        // Vérifier si orderId est un nombre valide
        if (isNaN(orderId)) {
            return res.status(400).send('L\'ID doit être un nombre valide');
        }

        // Préparer la suppression des commandes par l'id du user supprimé
        const deleteOrders = await prisma.order.deleteMany({
            where: {
                id: orderId,
            }
        });

        if(deleteOrders) {
            //Retourner une réponse
            return res.status(201).send("Commandes supprimée");
        } else {
            return res.status(400).send("Commande non supprimée");
        }

    } catch (error: any) {

        //Logger l'erreur
        console.log(error);

        res.status(500).send('Error during order registration');

    }
});

orderRoutes.get("/all", async (req, res) => {

    try {

        const orders = await prisma.order.findMany({
            include: {
                author: true,
                OrderProduct : {
                    include: {
                        product: true,
                    }
                }
            }
        });

        //Retourner une réponse
        return res.status(201).send(orders);

    } catch (error) {

        //Logger l'erreur
        console.log(error);

        return res.status(500).send('Erreur pendant la récupération dse users');

    }
});

orderRoutes.get("/:id", async (req, res) => {
    //Récupérer les données envoyées dans les paramètres url de la requête
    const { id } = req.params;

    try {
        // Convertir l'id de l'url en nombre
        const orderId = parseInt(id, 10);

        // Vérifier si orderId est un nombre valide
        if (isNaN(orderId)) {
            return res.status(400).send('L\'ID doit être un nombre valide');
        }

        //Rechercher l'order par son id
        const order = await prisma.order.findUnique({
            where: {
                id: orderId,
            },
            include: {
                author: true,
                OrderProduct : {
                    include: {
                        product: true,
                    }
                }
            }
        });

        //Renvoyer l'user
        return res.status(200).send(order);

    } catch (e) {

        //Logger l'erreur
        console.log(e);

        //Conditionné la réponse 
        res.status(500).send('Erreur pendant la récupération de l\'order');

    }

});

orderRoutes.put("/update/:id", async (req, res) => {
    //Récupérer les données envoyées dans le body de la requête
    const { id } = req.params;
    const { productId, quantity } : { productId: number, quantity: number} = req.body;

    try {

        // Convertir l'id de l'url en nombre
        const orderId = parseInt(id, 10);

        // Vérifier si userId est un nombre valide
        if (isNaN(orderId)) {
            return res.status(400).send('L\'ID doit être un nombre valide');
        }

        //Rechercher l'order par son id
        const order = await prisma.order.findUnique({
            where: {
                id: orderId,
            }
        });

        let updatedOrderProduct : OrderProduct;

        if (order) {
            //Rechercher l'orderProduct par l'id de l'order et du product
            const orderProduct = await prisma.orderProduct.findUnique({
                where: {
                    orderId_productId: {orderId, productId}
                }
            });
            if(orderProduct){
                // Update l'utilisateur en base de données
                updatedOrderProduct = await prisma.orderProduct.update({
                    where: {
                        orderId_productId: {orderId, productId}
                    },
                    data: {
                        quantity: quantity,
                    },
                });
            } else {
                // Ajouter l'order en base de données
                updatedOrderProduct = await prisma.orderProduct.create({
                    data: {
                        orderId: orderId,
                        productId: productId,
                        quantity: quantity
                    },
                });
            }
            

            if(updatedOrderProduct) {
                //Retourner une réponse
                return res.status(201).send("Ajouté à votre commande : " + updatedOrderProduct);
            } else {
                return res.status(400).send("La commande n\'a pas pu être mis à jour");
            }
        } else {
            return res.status(400).send("La commande n\'existe pas encore en base");
        }

    } catch (error) {

        //Logger l'erreur
        console.log(error);

        return res.status(500).send('Erreur lors de l\'enregistrement en base');

    }
});

export default orderRoutes;