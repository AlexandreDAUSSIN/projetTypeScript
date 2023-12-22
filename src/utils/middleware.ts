import { Request, Response, NextFunction } from 'express';
import { validationResult, body } from 'express-validator'; 
import { User } from '../classes/user';

export const validateAuthInputs = [
    body('email').notEmpty().withMessage('Le mail est requis'),
    body('password').notEmpty().withMessage('Le mot de passe est requis'),
    body('email').isEmail().withMessage('L\'email doit être une adresse email valide'),
    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        console.log(errors);
        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        next();
    }
];

export const isAdmin = function (req: Request, res: Response, next: NextFunction){
    const user: User = req.user as User;
    
    if (user.role === UserRole.Admin){
        console.log("Je suis admin");
        next();
    } else {
        return res.status(401).end();
    }
};

export const isManager = function (req: Request, res: Response, next: NextFunction){
    const user: User = req.user as User;
    
    if (user.role === UserRole.Manager){
        console.log("Je suis manager");
        next();
    } else {
        return res.status(401).end();
    }
};

export const isClient = function (req: Request, res: Response, next: NextFunction){
    const user: User = req.user as User;
    
    if (user.role === UserRole.Client){
        console.log("Je suis client");
        next();
    } else {
        return res.status(401).end();
    }
};

export const isManagerOrAdmin = function (req: Request, res: Response, next: NextFunction){
    const user: User = req.user as User;
    
    if (user.role === UserRole.Admin || user.role === UserRole.Manager){
        console.log("Je suis Admin ou Manager");
        next();
    } else {
        return res.status(401).end();
    }
};