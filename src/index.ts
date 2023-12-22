import passport from "passport";
import prisma from "./utils/database";
import express from "express";
import { rateLimit } from 'express-rate-limit';
import apiRouter from './routes/api.js';
import 'dotenv/config';
import './utils/passport';

async function main() {

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: true, // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    validate: {xForwardedForHeader: false}
  })

  //Définir l'application
  const app = express();
  const port = 3000;

  // Apply the rate limiting middleware to all requests.
  app.use(limiter)
  //Initialiser l'utilisation de passport
  app.use(passport.initialize());
  //Automatiquement parser les body des requêtes entrantes en Json
  app.use(express.json());

  //Définir les routes
  app.use("/api", apiRouter);

  app.get(
    "/protected",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      console.log(req.user);
      res.send("Vous êtes bien connecté !");
    }
  );
  
  //Démarrer le server
  app.listen(port, () => {
      console.log('Server is running');
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });