require('dotenv').config({path: '.env.dev'})
import { NextFunction, Request, RequestHandler, Response } from 'express'
import jwt, { JsonWebTokenError, JwtPayload, Secret } from 'jsonwebtoken'
import User, { Role } from '../models/User';

interface token extends JwtPayload {
   _id: string
}

export const auth: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // as the request comes in, check the request header for authorization
        const token = req.headers.authorization?.replace('Bearer ', '');

        // if no token present, send back error 
        if(!token){
            return res.status(401).send({ error: "Not authorized"})
        }

        // verify the token
        const verified = jwt.verify(token, process.env.JWT_SECRET as Secret) as token;
       
        // once verified, check for the _id in the database
        const userResult = await User.findOne({ _id: verified._id, 'tokens.token': token })
        
        if(!userResult){
            return res.status(404).send({ error: 'User not found' })
        }

        // save the user id and token to the req object
        req.user = userResult
        req.token = token

        next()
    } catch (error) {
        if((error as JsonWebTokenError).name !== null){
            if((error as JsonWebTokenError).name === 'TokenExpiredError' || (error as JsonWebTokenError).name === 'JsonWebTokenError'){
                return res.status(401).send({ error: (error as JsonWebTokenError).message })
            }
        }
        return res.status(400).send({ error: (error as Error).message })
    }
}


export const admin: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        // as the request comes in, check the request header for authorization
        const token = req.headers.authorization?.replace('Bearer ', '');
        // if no token present, send back error 
        if(!token){
            return res.status(401).send({ error: "Not authorized"})
        }


        // verify the token
        const verified = jwt.verify(token, process.env.JWT_SECRET as Secret) as token

        // once verified, check for the _id in the database
        const userResult = await User.findOne({ _id: verified._id, 'tokens.token': token })
        
        if(!userResult){
            return res.status(404).send({ error: 'User not found' })
        }

        if(userResult.role !== Role.admin){
            return res.status(401).send({ error: "Not authorized"})
        }

        // save the user id and token to the req object
        req.user = userResult
        req.token = token

        next()
    } catch (error) {
        return res.status(400).send({ error: (error as Error).message })
    }
}
