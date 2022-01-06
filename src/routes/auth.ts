import { Request, Response, Router } from 'express'
import User from '../models/User'
import bcrypt from 'bcryptjs'
import { auth } from '../middleware/auth'

const router = Router()

router.post('/signup', async (req: Request, res: Response) => {
    try {
        const dupEmail = await User.findOne({ email: req.body.email })

        // Check for duplicated email, and return a error is founded
        if(dupEmail){
            return res.status(400).send({ error: 'Please use a different email, email is taken'})
        }

        // If no duplicated email found , create an user
        // only accept these field to be set up by the client
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password, // will be hashed before saved
        })


        await user.save() 

        const token = await user.generateToken(); 

        // generateToken() will called the save() method

        res.status(201).send({user, token})
    } catch (error) {
        res.status(400).send({ error: (error as Error).message})
    }
})

router.post('/login', async (req: Request, res: Response) => {
    try {

        const user = await User.findOne({ email: req.body.email })
        // if user email does not exist
        if(!user){
           throw new Error('Unable to login, check email and password')
        } 
        // if user exist, check password
        const passwordMatch = await bcrypt.compare(req.body.password, user.password)

        // if password does not match
        if(!passwordMatch){
            throw new Error('Unable to login, check email and password')
        }

        if(user.isDisabled){
            throw new Error('Account has been suspended')
        }

        user.last_login = new Date()
        
        // generate the new token 
        const token = await user.generateToken()

        res.status(200).send({ user, token })
    } catch (error) {
        console.log(error)
        res.status(400).send({ error: (error as Error).message})
    }
})

router.post('/login/save', auth, async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.user?._id);
        // if user email does not exist
        if(!user){
           throw new Error('Unable to login, check email and password')
        } 
       
        if(user.isDisabled){
            throw new Error('Account has been suspended')
        }

        user.last_login = new Date()
        const token = req.headers.authorization?.replace('Bearer ', '');
        res.status(200).send({ user, token });
    } catch (error) {
        console.log(error)
        res.status(400).send({ error: (error as Error).message})
    }
})

router.post('/logout', auth, async(req:Request, res:Response) => {
    try {
        // find in database to see if the user exist
       const user = await User.findById(req.user?._id)

       if(!user){
           return res.status(404).send({ error: 'Not found'})
       }

       // find and remove the token 
       const index = user.tokens.findIndex((tokens) => tokens.token === req.token ) 
       user.tokens.splice(index, 1)

       await user.save()

       res.status(200).send()
    } catch (error) {
        res.status(400).send({ error: (error as Error).message})
    }
})

// forgot password - to send the link
// reset password - to verified the link and proceed with the password update

// update email 
// update name and profile pic
// email verify



export default router;