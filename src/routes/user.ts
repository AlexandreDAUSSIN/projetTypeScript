import express from "express";
import { User } from "../classes/user";
import prisma from "../utils/database";
import bcrypt from 'bcrypt';
import passport from "passport";
import { isAdmin } from "../utils/middleware";

// Définir le router
const userRoutes = express.Router();

//Définir les différentes routes
userRoutes.post("/add", async (req, res) => {
    //Récupérer les données envoyées dans le body de la requête
    const { email, name, password } = req.body;

    try {

        //Crypter le mot de passe
        const encryptedPassword = await bcrypt.hash(password, 10);

        // Ajouter l'utilisateur en base de données
        const newUser = await prisma.user.create({
            data: {
              email: email.toString(),
              name: name.toString(),
              password: encryptedPassword,
              role: UserRole.Client
            },
          });

        //Retourner une réponse
        return res.status(201).send(newUser);

    } catch (error: any) {

        //Logger l'erreur
        console.log(error);

        //Conditionné la réponse
        if (error.code == "11000") {
            return res.status(409).send('Email address is already in use.');
        }

        return res.status(500).send('Erreur lors de l\'enregistrement en base');

    }
});

userRoutes.delete("/delete/:id", passport.authenticate("jwt", { session: false }), isAdmin, async (req, res) => {
    //Récupérer les données envoyées dans le body de la requête
    const { id } = req.params;

    try {

        // Convertir l'id de l'url en nombre
        const userId = parseInt(id, 10);

        // Vérifier si userId est un nombre valide
        if (isNaN(userId)) {
            return res.status(400).send('L\'ID doit être un nombre valide');
        }

        // Préparer la suppression du user par son id
        const userDeleted = await prisma.user.delete({
            where: {
                id: userId,
            }
        });

        if(userDeleted) {
            //Retourner une réponse
            return res.status(204).send("Utilisateur supprimé");
        } else {
            return res.status(500).send("Utilisateur non supprimé");
        }

    } catch (error: any) {

        //Logger l'erreur
        console.log(error);

        res.status(500).send('Error during user registration');

    }
});

userRoutes.get("/all", passport.authenticate("jwt", { session: false }), isAdmin, async (req, res) => {

    try {

        const users = await prisma.user.findMany();

        //Retourner une réponse
        return res.status(200).send(users);

    } catch (error) {

        //Logger l'erreur
        console.log(error);

        return res.status(500).send('Erreur pendant la récupération dse users');

    }
});

userRoutes.get("/:id", passport.authenticate("jwt", { session: false }), isAdmin, async (req, res) => {
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

userRoutes.put("/update/:id", passport.authenticate("jwt", { session: false }), isAdmin, async (req, res) => {
    //Récupérer les données envoyées dans le body de la requête
    const { id } = req.params;
    const { email, name, password } = req.body;

    try {

        // Convertir l'id de l'url en nombre
        const userId = parseInt(id, 10);

        //Crypter le mot de passe
        const encryptedPassword = await bcrypt.hash(password, 10);

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
                    email: email.toString(),
                    name: name.toString(),
                    password: encryptedPassword,
                },
            });

            if(udpatedUser) {
                //Retourner une réponse
                return res.status(201).send(udpatedUser);
            } else {
                return res.status(500).send("L\'utilisateur n\'a pas pu être mis à jour");
            }
        } else {
            return res.status(500).send("L\'utilisateur n\'existe pas encore en base");
        }

    } catch (error) {

        //Logger l'erreur
        console.log(error);

        return res.status(500).send('Erreur lors de l\'enregistrement en base');

    }
});

export default userRoutes;