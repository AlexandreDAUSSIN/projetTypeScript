"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
//Définir les paramètres de la stratégie
const params = {
    //Préciser où récupérer le token
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    //Préciser la secret key utilisé
    secretOrKey: process.env.JWT_SECRET
};
//Utilisé une nouvelle stratégie
passport_1.default.use(new passport_jwt_1.Strategy(params, (jwt_payload, done) => {
    //Vérifier que le token comporte un utilisateur
    if (jwt_payload.user) {
        //Valider l'authentification
        return done(null, jwt_payload.user);
    }
    //Réfuter l'authentification
    return done(null, false);
}));
