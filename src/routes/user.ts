import express from "express";
import { User } from "../classes/user";
import prisma from "../utils/database";
import bcrypt from 'bcrypt';

// Définir le router
const userRoutes = express.Router();

//Définir les différentes routes
userRoutes.post("/add", async (req, res) => {
    //Récupérer les données envoyées dans le body de la requête
    const { email, name, password } = req.body;

    try {

        //Crypter le mot de passe
        const encryptedPassword = await bcrypt.hash(password, 10);

        //Créer l'utilisateur
        const newUser = new User(email, name, encryptedPassword);

        // Ajouter l'utilisateur en base de données
        await prisma.user.create({
            data: {
              email: newUser.email.toString(),
              name: newUser.name.toString(),
              password: newUser.password.toString(),
            },
          });

        //Retourner une réponse
        return res.status(201).send(newUser);

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

userRoutes.delete("/delete", async (req, res) => {
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
        const deleteOrders = prisma.order.deleteMany({
            where: {
                authorId: userId,
            }
        });

        // Préparer la suppression du user par son id
        const deleteUser = prisma.user.delete({
            where: {
                id: userId,
            }
        });

        const transaction = await prisma.$transaction([deleteOrders, deleteUser])

        if(transaction) {
            //Retourner une réponse
            return res.status(201).send("Utilisateur et commandes supprimés");
        } else {
            return res.status(400).send("Utilisateur ou commande non supprimés");
        }

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

userRoutes.get("/all", async (req, res) => {

    try {

        const users = await prisma.user.findMany();

        //Retourner une réponse
        return res.status(201).send(users);

    } catch (error) {

        //Logger l'erreur
        console.log(error);

        return res.status(500).send('Erreur pendant la récupération dse users');

    }
});

userRoutes.get("/:id", async (req, res) => {
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
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            }
        });

        //Renvoyer l'user
        return res.status(200).send(user);

    } catch (e) {

        //Logger l'erreur
        console.log(e);

        //Conditionné la réponse 
        res.status(500).send('Erreur pendant la récupération de l\'user');

    }

});

userRoutes.post("/update:id", async (req, res) => {
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
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            }
        });

        if (user) {
            // Update l'utilisateur en base de données
            const udpatedUser = await prisma.user.update({
                where: {
                    id: user?.id,
                },
                data: {
                email: user.email.toString(),
                name: user.name.toString(),
                password: user.password.toString(),
                },
            });

            if(udpatedUser) {
                //Retourner une réponse
                return res.status(201).send(udpatedUser);
            } else {
                return res.status(400).send("L\'utilisateur n\'a pas pu être mis à jour");
            }
        } else {
            return res.status(400).send("L\'utilisateur n\'existe pas encore en base");
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

export default userRoutes;