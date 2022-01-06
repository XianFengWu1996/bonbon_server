import request from 'supertest'
import app from '../src/index'
import Recipe from '../src/models/Recipe'
import { generateAllData, recipeOne, userOneData, userTwoData, validRecipe, invalidRecipe, recipeTwo, materialTwo} from './utils/db'

beforeAll(generateAllData)

describe('TEST GET RECIPES', () => {
    test('should get all recipe by the user', async () => {
        const response = await request(app).get('/recipe')
        .set('Authorization', `Bearer ${userOneData.tokens[0].token}`)

        // USERONE HAS ONE RECIPE, USERTWO HAS ONE 
        expect(response.body.length).toEqual(2)
    })

    test('should not get recipe with invalid credential', async () => {
        await request(app).get('/recipe')
        .set('Authorization', `Bearer ${userOneData._id}wrong`).expect(400)
    })

    test('should not get recipe without credential', async () => {
        await request(app).get('/recipe').expect(401)
    })
})

describe('TEST GET RECIPE WITH ID', () => {
    test('should get recipe with valid id and valid credential', async () => {
        const response = await request(app).get(`/recipe/${recipeOne._id}`)
        .set('Authorization', `Bearer ${userOneData.tokens[0].token}`)
        .expect(200)

        const recipe = await Recipe.findById(response.body.recipe._id)

        expect(recipe).not.toBeNull()
        expect(recipe.name).toBe(recipeOne.name)
        expect(recipe.description).toBe(recipeOne.description)
        expect(recipe.total).toBe(recipeOne.total)
        expect(recipe.items.length).toEqual(recipeOne.items.length)
    })

    
    test('should not get recipe with valid id and invalid credential', async () => {
        await request(app).get(`/recipe/${recipeOne._id}`)
        .set('Authorization', `Bearer ${userTwoData.tokens[0].token}`)
        .expect(404)
    })

    test('should not get recipe with invalid id and valid credential', async () => {
        await request(app).get(`/recipe/${recipeOne._id}wrong`)
        .set('Authorization', `Bearer ${userOneData.tokens[0].token}`)
        .expect(400)
    })

    test('should not get recipe without credential', async () => {
        await request(app).get(`/recipe/${recipeOne._id}`)
        .expect(401)
    })
    
})

describe('TEST POST RECEIPE', () => {
    test('should post with valid data and valid crdential', async () => {
        const response = await request(app).post('/recipe')
        .set('Authorization', `Bearer ${userOneData.tokens[0].token}`)
        .send(validRecipe).expect(201)

        const recipe = await Recipe.findById(response.body.recipe._id)
        expect(recipe).not.toBeNull()
        expect(recipe.name).toBe(validRecipe.name)
        expect(recipe.description).toBe(validRecipe.description)
        expect(recipe.total).toBe(validRecipe.total)
        expect(recipe.items.length).toEqual(validRecipe.items.length)
    })

    test('should not post with valid data and invalid crdential', async () => {
        await request(app).post('/recipe')
        .set('Authorization', `Bearer ${userOneData.tokens[0].token}wrong`)
        .send(validRecipe).expect(400)
    })

    test('should not post with invalid data and valid crdential', async () => {
        await request(app).post('/recipe')
        .set('Authorization', `Bearer ${userOneData.tokens[0].token}`)
        .send(invalidRecipe).expect(400)
    })

    test('should not post without crdential', async () => {
        await request(app).post('/recipe')
        .send(validRecipe).expect(401)
    })
    
})

describe('TEST UPDATE RECIPE', () => {

    let changeData = {
        name: "I am change",
        description: 'Description changed too',
        items: [                
            { materials: materialTwo._id, amount: 200, cost: 6.99 }
        ],
        total: 150,
    }

    test('should update with valid data, valid recipe id, valid credential', async () => {
        await request(app).patch(`/recipe/${recipeTwo._id}`)
        .set('Authorization', `Bearer ${userOneData.tokens[0].token}`)
        .send(changeData).expect(200)

        const recipe = await Recipe.findById(recipeTwo._id)

        expect(recipe.total).toBe(changeData.total)
        expect(recipe.name).toBe(changeData.name)
        expect(recipe.description).toBe(changeData.description)
        expect(recipe.items.length).toBe(changeData.items.length)
    })

    test('should not update with invalid data, valid recipe id, valid credential', async () => {
        await request(app).patch(`/recipe/${recipeTwo._id}`)
        .set('Authorization', `Bearer ${userOneData.tokens[0].token}`)
        .send({
            ...changeData,
            wrong: 'data',
        }).expect(400)
    })

    test('should not update with valid data, invalid recipe id, valid credential', async () => {
        await request(app).patch(`/recipe/${recipeTwo._id}asd`)
        .set('Authorization', `Bearer ${userOneData.tokens[0].token}`)
        .send(changeData).expect(400)
    })

    test('should not update with valid data, valid recipe id, invalid credential', async () => {
        await request(app).patch(`/recipe/${recipeTwo._id}`)
        .set('Authorization', `Bearer ${userTwoData.tokens[0].token}`)
        .send(changeData).expect(404)
    })

    test('should not update without credential', async () => {
        await request(app).patch(`/recipe/${recipeTwo._id}`)
        .send(changeData).expect(401)
    })
    
})

describe('TEST DELETE RECIPE', () => {
    test('should delete recipe with valid recipe id and valid credential', async () => {
        const response = await request(app).delete(`/recipe/${recipeOne._id}`)
        .set('Authorization', `Bearer ${userOneData.tokens[0].token}`)
        .expect(200)

        const recipe = await Recipe.findById(response.body.recipe._id)

        expect(recipe).toBeNull()
    })

    test('should not delete recipe with invalid recipe id and valid credential', async () => {
        await request(app).delete(`/recipe/${recipeOne._id}`)
        .set('Authorization', `Bearer ${userOneData.tokens[0].token}`)
        .expect(404)
    })

    test('should not delete recipe with valid recipe id and invalid credential', async () => {
        await request(app).delete(`/recipe/${recipeOne._id}`)
        .set('Authorization', `Bearer ${userTwoData.tokens[0].token}`)
        .expect(404)
    })

    test('should not delete recipe without credential', async () => {
        await request(app).delete(`/recipe/${recipeOne._id}`)
        .expect(401)
    })
    
})


