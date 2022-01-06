import { Request, Response, Router } from 'express'
import { auth } from '../middleware/auth'
import Material, { MaterialSchema } from '../models/Material'
import Units from '../models/Unit'

const router = Router()

// Get all materials 
router.get('/materials', auth, async (req: Request, res: Response) => {
    try {
        const materials = await Material.find({ owner: req.user?.id}).populate('unit').exec()

        res.send({ materials })
    } catch (error) {
        console.log(error)
        res.status(400).send({ error: (error as Error).message})
    }
})

// Get materials by id
router.get('/materials/:id', auth, async (req: Request, res: Response) => {
    try {
        const material = await Material.findOne({ _id: req.params.id, owner: req.user?.id})

        if(!material){
            return res.status(404).send({ error: "Not found"})
        }

        res.send({ material })
    } catch (error) {
        res.status(400).send({ error: (error as Error).message})
    }
})

// Create a material
router.post('/materials', auth,  async (req: Request, res: Response) => {
    try {

        // make sure the unit is one of the valid unit in the db
        const unit = await Units.findById(req.body.unit)

        if(!unit){
            return res.status(404).send({ error: 'Require a unit'})
        }

        const material = new Material({
            unit: req.body.unit,
            name: req.body.name,
            totalUnitAmount: req.body.totalUnitAmount,
            price: req.body.price,
            unitPrice: req.body.unitPrice,
            owner: req.user?.id})

        await material.save()

        res.status(201).send({material})
    } catch (error) {
        res.status(400).send({ error: (error as Error).message})
    }
})

router.patch('/materials/:id', auth,  async (req: Request, res: Response) => {
    try {
        let allowedField = Object.keys(MaterialSchema.paths)
        allowedField = allowedField.filter((field) => {
            return field !== '_id' && field !== '__v' && field !== 'owner'
        })
        const requestField = Object.keys(req.body)
        
        const isValid = requestField.every((field) => allowedField.includes(field))

        if(!isValid){
            return res.status(400).send({ error: 'Invalid fields'})
        }

        const material = await Material.findOneAndUpdate(
            {_id: req.params.id, owner: req.user?.id}, 
            {$set: req.body},
            { new: true}
        )

        if(!material){
            return res.status(404).send({ error: 'Not found'})
        }

        res.send({ material })
        
        
    } catch (error) {
        res.status(400).send({ error: (error as Error).message})
    }
})

router.delete('/materials/:id', auth, async (req: Request, res: Response) => {
    try {
        const material = await Material.findOneAndDelete({ _id: req.params.id, owner: req.user?.id })

        if(!material){
            return res.status(404).send({ error: 'Not found'})
        }

        res.send({ material })
    } catch (error) {
        res.status(400).send({ error: (error as Error).message})
    }
})

export default router