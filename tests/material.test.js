import app from '../src/index'
import request from 'supertest'
import {generateAllData, invalidMaterial, materialOne, userOneData, userTwoData, validMaterial } from './utils/db'
import Materials from '../src/models/Material'

beforeAll(generateAllData)

describe('TEST GET ALL MATERIALS', () => {
    test('should get all materials with valid credential', async () => {
        const response = await request(app).get('/materials')
        .set('Authorization', `Bearer ${userOneData.tokens[0].token}`)
        .expect(200)
        // USERONE ONLY HAS TWO MATERIALS AND USERTWO HAS ONE MATERIALS
        expect(response.body.materials.length).toBe(2)
    })

    test('should not get all materials with invalid credential', async () => {
        await request(app).get('/materials')
        .set('Authorization', `Bearer ${userOneData.tokens[0].token}wrong`)
        .expect(400)
    })
    
    test('should not get all materials without credential', async () => {
        await request(app).get('/materials')
        .expect(401)
    })
})

describe('TEST GET MATERIALS BY ID', () => {
    test('should get materials by the valid material id and valid authorization', async () => {
        const response  = await request(app).get(`/materials/${materialOne._id}`)
        .set('Authorization', `Bearer ${userOneData.tokens[0].token}`)
        .expect(200)
        
        const material = await Materials.findById(response.body.material._id)
        
        expect(material).not.toBeNull()

        expect(material.name).toBe(materialOne.name)
        expect(material.price).toBe(materialOne.price)
        expect(material.unitPrice).toBe(materialOne.unitPrice)
        expect(material.totalUnitAmount).toBe(materialOne.totalUnitAmount)
    })

    test('should not get materials with invalid material id but valid authorization', async () => {
        await request(app).get(`/materials/${materialOne._id}wrong`)
        .set('Authorization', `Bearer ${userOneData.tokens[0].token}`)
        .expect(400)
    })

    test('should not get materials with valid material id not belonging to the user', async () => {
        await request(app).get(`/materials/${materialOne._id}`)
        .set('Authorization', `Bearer ${userTwoData.tokens[0].token}`)
        .expect(404)
    })

    test('should get materials without authorization', async () => {
        await request(app).get(`/materials/${materialOne._id}`)
        .expect(401)
    })
    
})

describe('TEST POST MATERIAL', () => {
    test('should post material with valid data and valid authorization', async () => {
        const response = await request(app).post('/materials')
        .set('Authorization', `Bearer ${userOneData.tokens[0].token}`)
        .send(validMaterial)
        .expect(201)

        const material = await Materials.findById(response.body.material._id)

        expect(material).not.toBeNull()

        expect(material.name).toBe(validMaterial.name)
        expect(material.price).toBe(validMaterial.price)
        expect(material.unitPrice).toBe(validMaterial.unitPrice)
        expect(material.totalUnitAmount).toBe(validMaterial.totalUnitAmount)
    })
    
    test('should not post material with invalid data ', async () => {
        await request(app).post('/materials')
        .set('Authorization', `Bearer ${userOneData.tokens[0].token}`)
        .send(invalidMaterial)
        .expect(400)
    })

    test('should not post material with valid data but invalid authorization', async () => {
        await request(app).post('/materials')
        .set('Authorization', `Bearer ${userOneData.tokens[0].token}123`)
        .send(validMaterial)
        .expect(400)
    })

    test('should not post material without authorization', async () => {
        await request(app).post('/materials')
        .send(validMaterial)
        .expect(401)
    })
    
    
})

describe('TEST UPDATE MATERIAL', () => {
    test('should update material with valid data, valid material id, and valid authorization', async() => {
        let changedName = 'IamChanged'
        let changedPrice = 12.99
        const response = await request(app).patch(`/materials/${materialOne._id}`)
        .set('Authorization', userOneData.tokens[0].token)
        .send({
            name:  changedName,
            price: changedPrice
        }).expect(200)

        const material = await Materials.findById(materialOne._id)

        expect(material).not.toBeNull()

        expect(response.body.material.name).toBe(changedName.toLowerCase())
        expect(response.body.material.price).toBe(changedPrice)
    })
    
    test('should not update material with invalid data, valid material id, and valid authorization', async() => {
        await request(app).patch(`/materials/${materialOne._id}`)
        .set('Authorization', userOneData.tokens[0].token)
        .send({
            wrongdata:  'wrongdata',
            price: 12.99
        }).expect(400)
    })

    test('should not update material with valid data, invalid material id, and valid authorization', async() => {
        await request(app).patch(`/materials/${materialOne._id}asd`)
        .set('Authorization', userOneData.tokens[0].token)
        .send({
            price: 12.99
        }).expect(400)
    })

    test('should not update material with valid data, valid material id, and invalid authorization', async() => {
        await request(app).patch(`/materials/${materialOne._id}`)
        .set('Authorization', `${userTwoData.tokens[0].token}`)
        .send({
            price: 12.99
        }).expect(404)
    })

    test('should update material without authorization', async() => {
        await request(app).patch(`/materials/${materialOne._id}`)
        .send({ price: 12.99 }).expect(401)
    })

})

describe('TEST DELETE MATERIAL', () => {
    test('should update with valid material id, valid credential', async () => {
        const response = await request(app).delete(`/materials/${materialOne._id}`)
        .set('Authorization', `Bearer ${userOneData.tokens[0].token}`).expect(200)

        const material = await Materials.findById(response.body.material._id)

        expect(material).toBeNull()
    })
    
    test('should not update with valid material id, invalid credential', async () => {
        await request(app).delete(`/materials/${materialOne._id}`)
        .set('Authorization', `Bearer ${userTwoData.tokens[0].token}`).expect(404)
    })
    test('should not update with invalid material id, but valid credential', async () => {
        await request(app).delete(`/materials/${materialOne._id}123123`)
        .set('Authorization', `Bearer ${userTwoData.tokens[0].token}`).expect(400)
    })

    test('should not update without credential', async () => {
        await request(app).delete(`/materials/${materialOne._id}123123`)
        .expect(401)
    })
})

