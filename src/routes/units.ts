import { Request, Response, Router } from 'express'
import { admin, auth } from '../middleware/auth';
import Units, { unitSchema } from '../models/Unit'

const router = Router()

// ONLY PUBLIC ROUTES - Grab all the available units
router.get('/units', auth,async (req: Request, res: Response) => {
    try {
        const unit = await Units.find();

        res.send({unit})
    } catch (error) {
        res.status(400).send({ error: (error as Error).message})
    }
})


// PRIVATE ROUTES ONLY ACCESIBLE FOR ADMIN USERS
// CREATE NEW UNITS 
router.post('/units', admin, async (req: Request, res: Response) => {
    try {
        // TO MAKE SURE ALL OF THESE FIELD ARE VALID NOT EMPTY OR NULL
        const { name, chinese, shortHand, conversion }  = req.body
        if(typeof name !== 'string' || typeof chinese !== 'string' ||
        typeof shortHand !== 'string' || typeof conversion !== 'number'){
            return res.status(400).send({ error: 'Invalid fields'})
        }

        // SEARCH FOR ANY DUPLICATE BY THE NAME
        const isDup = await Units.findOne({ name: req.body.name })
        if(isDup){
            return res.status(400).send({ error: 'Units already exists'})
        }

        // CREATE A NEW UNITS AND SAVE
        const unit = new Units(req.body) 
        await unit.save()

        res.status(201).send({unit})
    } catch (error) {
        res.status(400).send({ error: (error as Error).message})
    }
})

// UPDATE UNITS 
router.patch('/units/:id', admin, async (req: Request, res: Response) => {
    try {

        // get all the available field name
        let allowedField = Object.keys(unitSchema.paths)
        // remove the _id and __v field, dont want client to temper with it
        allowedField = allowedField.filter((field) => {
            return field !== '_id' && field !== '__v'
        })
        // check if the user has pass in the correct field to update
        const updateField = Object.keys(req.body)
        const isValid = updateField.every((field) => {
            return allowedField.includes(field)
        })
        if(!isValid){
            return res.status(400).send({ error: 'Update is not valid'})
        }
        if(Object.entries(req.body).length === 0){
            return res.status(400).send({ error: 'Please add fields for update'})
        }

        // Need to have admin permission
        // Find the unit by id and update the fields 
        const unit = await Units.findOneAndUpdate({ _id: req.params.id }, {
           $set: req.body
        }, {new: true})
    
        if(!unit){
            return res.status(404).send()
        }

        res.send({unit})
    } catch (error) {
        res.status(400).send({ error: (error as Error).message})
    }
})

// DELETE UNITS
router.delete('/units/:id', admin, async(req: Request, res: Response) => {
    try {
        const unit = await Units.findByIdAndDelete(req.params.id)

        if(!unit){
            return res.status(404).send()
        }

        res.send({unit})
    } catch (error) {
        res.status(400).send({ error: (error as Error).message})
    }
})



export default router