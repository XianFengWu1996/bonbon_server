import { Request, response, Response, Router } from "express";
import { auth } from "../middleware/auth";
import Recipe from "../models/Recipe";

const router = Router()

// GET ALL THE RecipeS 
router.get('/recipe', auth, async (req: Request, res: Response) => {
    try {
        const recipe = await Recipe.find({owner: req.user?._id}).populate({ 
            path: 'owner', 
            select: 'name email'}).exec()

        // const recipe = await Recipe.find({owner: req.user?._id})

        if(!recipe){
            return res.status(404).send()
        } 
        res.send(recipe)
    } catch (error) {
        res.status(400).send({ error: (error as Error).message })
    }
})

// GET A Recipe BY ID
router.get('/recipe/:id', auth, async (req: Request, res: Response) => {
    try {
        const recipe = await Recipe.findOne({ _id: req.params.id, owner: req.user?._id })
            .populate({ path: 'owner', select: 'name email'})
            .populate({ path: 'items.materials', select: 'id name totalUnitAmount price unitPrice' })
            .exec()
        if(!recipe){
            return res.status(404).send()
        }

        res.send({recipe})

    } catch (error) {
        res.status(400).send({ error: (error as Error).message })
    }
})

// CREATE A NEW Recipe 
router.post('/recipe', auth, async (req: Request, res: Response) => {
    try {
        const recipe = new Recipe({
            name: req.body.name,
            description: req.body.description,
            items: req.body.items,
            total: req.body.total,
            owner: req.user?._id
        })

        await recipe.save()

        res.status(201).send({recipe})
    } catch (error) {
        res.status(400).send({ error: (error as Error).message})
    }
})

// UPDATING THE Recipe BY ID
router.patch('/recipe/:id', auth, async (req: Request, res: Response) => {
    // only certain field can be alter by the client
    // name, description, materials, total
    const allowedField = ['name', 'description', 'items', 'total']
    const requestFields = Object.keys(req.body)

    const isValid = requestFields.every(field => allowedField.includes(field))

    try {

        if(!isValid){
            return res.status(400).send({ error: 'Invalid fields'})
        }

        const recipe = await Recipe.findOneAndUpdate({
            _id: req.params.id,
            owner: req.user?._id
        }, {
            $set: req.body
        }, {
            new: true
        })

        if(!recipe){
            return res.status(404).send()
        }

        res.send({recipe})

    } catch (error) {
        res.status(400).send({ error: (error as Error).message})
    }
})

// DELETE THE Recipe BY ID
router.delete('/recipe/:id', auth, async (req: Request, res: Response) => {
    try {
        const recipe = await Recipe.findOneAndDelete({ _id: req.params.id, owner: req.user?._id})

        if(!recipe){
            return res.status(404).send()
        }

        res.send({recipe})
    } catch (error) {
        res.status(400).send({ error: (error as Error).message})
    }
})



export default router