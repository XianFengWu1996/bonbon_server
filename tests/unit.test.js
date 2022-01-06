import request from 'supertest'
import app from '../src/index'
import Units from '../src/models/Unit'
import { generateAllData, invalidUnits, unitOne, unitThree, unitTwo, userOneData, userTwoData, validUnits } from './utils/db'

beforeAll(generateAllData)

describe('TESTING GET UNIT',  () => {
    test('Should get all unit as member', async () => {
        const response = await request(app)
        .get('/units')
        .set('Authorization', userOneData.tokens[0].token).expect(200)

        expect(response.body.unit.length).toBe(3) // seeded 3 unit data in, should receive 3 as response
        expect(response.body.unit[0]).toMatchObject(unitOne)
        expect(response.body.unit[1]).toMatchObject(unitTwo)
        expect(response.body.unit[2]).toMatchObject(unitThree)
    })

    test('Should get all unit as admin', async () => {
        const response = await request(app)
        .get('/units')
        .set('Authorization', userTwoData.tokens[0].token).expect(200)

        expect(response.body.unit.length).toBe(3) // seeded 3 unit data in, should receive 3 as response
    })

    test('Should not get unit without authorization', async () => {
        await request(app).get('/units').expect(401)
    })
})

describe('TESTING POSTING UNIT', () => {
    test('Should create unit as admin', async () => {
        const response = await request(app).post('/units')
        .set('Authorization', `Bearer ${userTwoData.tokens[0].token}`)
        .send(validUnits)
        .expect(201)

        const unit = await Units.findById(response.body.unit._id)

        expect(unit).not.toBeNull()
        expect(unit.name).toBe(validUnits.name)
        expect(unit.chinese).toBe(validUnits.chinese)
        expect(unit.shortHand).toBe(validUnits.shortHand)
        expect(unit.conversion).toBe(validUnits.conversion)
        expect(unit.needsConversion).toBe(validUnits.needsConversion)

    })

    test('Should not create unit with invalid data', async () => {
        await request(app).post('/units')
        .set('Authorization', `Bearer ${userTwoData.tokens[0].token}`)
        .send(invalidUnits)
        .expect(400)    
    })

    test('Should not create unit as member', async () => {
        await request(app).post('/units')
        .set('Authorization', `Bearer ${userOneData.tokens[0].token}`)
        .send(validUnits)
        .expect(401)
    })

    test('Should not create unit without authorization', async () => {
        await request(app).post('/units')
        .send(validUnits)
        .expect(401)
    })
})

describe('TESTING UPDATE UNIT', () => {
    test('Should update with valid data and admin role', async () => {
        await request(app).patch(`/units/${unitOne._id}`)
        .set('Authorization', `Bearer ${userTwoData.tokens[0].token}`)
        .send(validUnits).expect(200)

        const unit = await Units.findById(unitOne._id)

        expect(unit).not.toBeNull()
        expect(unit.name).toBe(validUnits.name)
        expect(unit.shortHand).toBe(validUnits.shortHand)
        expect(unit.chinese).toBe(validUnits.chinese)
        expect(unit.conversion).toBe(validUnits.conversion)
        expect(unit.needsConversion).toBe(validUnits.needsConversion)
    })

    test('Should update with partial valid data and admin role', async () => {
        await request(app).patch(`/units/${unitOne._id}`)
        .set('Authorization', `Bearer ${userTwoData.tokens[0].token}`)
        .send({
            name: validUnits.name,
            shortHand: validUnits.shortHand
        }).expect(200)

        const unit = await Units.findById(unitOne._id)

        expect(unit.name).toBe(validUnits.name)
        expect(unit.shortHand).toBe(validUnits.shortHand)
    })

    test('Should not update with valid data and admin role but invalid unit id', async () => {
        await request(app).patch(`/units/${unitOne._id}asd`)
        .set('Authorization', `Bearer ${userTwoData.tokens[0].token}`)
        .send(validUnits).expect(400)
    })

    test('Should not update with invalid data and admin role', async () => {
        await request(app).patch(`/units/${unitOne._id}`)
        .set('Authorization', `Bearer ${userTwoData.tokens[0].token}`)
        .send({
            wrong: validUnits.name,
            wrongaswell: validUnits.name,
            shortHand: validUnits.shortHand
        }).expect(400)
    })

    test('Should not update with valid data and non admin role', async () => {
        await request(app).patch(`/units/${unitOne._id}`)
        .set('Authorization', `Bearer ${userOneData.tokens[0].token}`)
        .send(validUnits).expect(401)
    })

    test('Should not update without authorization', async () => {
        await request(app).patch(`/units/${unitOne._id}`)
        .send(validUnits).expect(401)
    })
})

describe('TESTING DELETE UNIT', () => {
    test('Should delete with valid unit id and valid authorization', async () => {
        await request(app).delete(`/units/${unitOne._id}`)
        .set('Authorization', `Bearer ${userTwoData.tokens[0].token}`)
        .expect(200)
    })

    test('Should not delete with invalid unit id and valid authorization', async () => {
        await request(app).delete(`/units/${unitOne._id}123`)
        .set('Authorization', `Bearer ${userTwoData.tokens[0].token}`)
        .expect(400)
    })

    test('Should not delete with valid unit and invalid authorization', async () => {
        await request(app).delete(`/units/${unitOne._id}`)
        .set('Authorization', `Bearer ${userOneData.tokens[0].token}`)
        .expect(401)
    })

    test('Should not delete without authorization', async () => {
        await request(app).delete(`/units/${unitOne._id}`)
        .expect(401)
    })
})