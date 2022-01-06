// TESTING FOR USER FUNCTIONALITY
import mongoose from 'mongoose'
import app from '../src/index'
import request from 'supertest'
import User from '../src/models/User'
import { generateAllData, invalidCredentials, userOneData, validCredentials } from './utils/db'

beforeAll(generateAllData)

describe('TESTING SIGN UP', () => {
    test('Should sign up with valid credential', async () => {
        const response = await request(app).post('/signup').send({...validCredentials}).expect(201)

        // check if user is not null and is in the database
        const user = await User.findById(response.body.user._id)

        expect(user).not.toBeNull()
        // check email, name, and password
        expect(user.name.toLowerCase()).toBe(validCredentials.name.toLowerCase())
        expect(user.email.toLowerCase()).toBe(validCredentials.email.toLowerCase())
        expect(user.password).not.toBe(validCredentials.password)
    } )

    test('Should not sign up with no credential', async () => {
        await request(app).post('/signup').expect(400)
    })

    test('Should not sign up with duplicate email', async () => {
        await request(app).post('/signup').send(userOneData).expect(400)
    })

    test('Should not sign up with invalid credential', async () => {
        await request(app).post('/signup').send(invalidCredentials).expect(400)
    })
    
})

describe('TESTING LOGOUT', () => {
    test('Should logout with valid credential', async () => {
        await request(app)
        .post('/logout')
        .set('Authorization', `Bearer ${userOneData.tokens[0].token}`)
        .expect(200)
    })

    test('Should not logout with invalid credential', async () => {
        await request(app)
        .post('/logout')
        .set('Authorization', `Bearer ${userOneData.tokens[0].token}asd`)
        .expect(400)
    })

    test('Should not logout with no credential', async () => {
        await request(app)
        .post('/logout')
        .expect(401)
    })
})

describe('TESTING LOGIN', () => {
    test('Should login with valid credentials', async () => {
        const response = await request(app).post('/login').send({
            email: userOneData.email,
            password: userOneData.password
        }).expect(200)

        const user = await User.findById(response.body.user._id)

        expect(user).not.toBeNull()
        // the new token generated should be the pass into the tokens array

        expect(user.tokens.find((token) => token === response.body.token)).toBeTruthy
    })

    test('Should not login with invalid email', async () => {
        await request(app).post('/login').send({
            email: 'shasw13@email.com',
            password: userOneData.password
        }).expect(400)
    })

    test('Should not login with invalid password', async () => {
        await request(app).post('/login').send({
            email: userOneData.email,
            password: '1329asd123'
        }).expect(400)
    })

    test('Should not login with no credentials', async () => {
        await request(app).post('/login').send().expect(400)
    })
})

