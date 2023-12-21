import passport from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";

//Définir les paramètres de la stratégie
const params = {
    //Préciser où récupérer le token
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    //Préciser la secret key utilisé
    secretOrKey: process.env.JWT_SECRET
};

//Utilisé une nouvelle stratégie
passport.use(new Strategy(params, (jwt_payload, done) => {
    //Vérifier que le token comporte un utilisateur
    if (jwt_payload.user){
        //Valider l'authentification
        return done(null, jwt_payload.user);
    }
    //Réfuter l'authentification
    return done(null, false);
}));