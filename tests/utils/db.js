import mongoose from 'mongoose'
import Materials from "../../src/models/Material"
import Units from "../../src/models/Unit"
import User from "../../src/models/User"
import Recipe from '../../src/models/Recipe'
import jwt from 'jsonwebtoken'

// ================================
// USER
// ================================

export const userOneId = new mongoose.Types.ObjectId
export const userTwoId = new mongoose.Types.ObjectId

export const userOneData = {
    _id: userOneId,
    email: "sophialin@gmail.com",
    password: '12345678',
    name: 'Sophia',
    tokens: [
        {
            token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET)
        }
    ]
}

export const userTwoData = {
    _id: userTwoId,
    email: "shawnwu1996@hotmail.com",
    password: '1234asdf',
    name: 'Shawn',
    role: 'admin',
    tokens: [
        {
            token: jwt.sign({_id: userTwoId}, process.env.JWT_SECRET)
        }
    ]
}

export const validCredentials = {
    email: "shawnwu1996@gmail.com",
    password: 'asdf1234',
    name: 'Andrew'
}

export const invalidCredentials = {
    email: "shawnwu@gmail.com",
    password: 'asdf12',
    name: "John"
}

// ================================
// UNITS 
// ================================

export const unitOne = {
    _id: new mongoose.Types.ObjectId,
    name: 'each',
    chinese: '每个',
    shortHand: 'ea',
    conversion: 1,
    needsConversion: false,
}

export const unitTwo = {
    _id: new mongoose.Types.ObjectId,
    name: 'pound',
    chinese: '磅',
    shortHand: 'lb',
    conversion: 453.592,
    needsConversion: true,
}

export const unitThree = {
    _id: new mongoose.Types.ObjectId,
    name: 'ounce',
    chinese: '盎司',
    shortHand: 'oz',
    conversion: 28.3495,
    needsConversion: true,
}

export const validUnits = {
    name: 'kilogram',
    chinese: '公斤',
    shortHand: 'kg',
    conversion: 1000,
    needsConversion: true,
}

export const invalidUnits = {
    name: 'wrong',
    shortHand: 'missing chinese',
    conversion: 28.3495,
    needsConversion: true,
}


// ================================
// MATERIALS
// ================================

const materialOneId = new mongoose.Types.ObjectId
const materialTwoId = new mongoose.Types.ObjectId
const materialThreeId = new mongoose.Types.ObjectId

export const materialOne = {
    _id: materialOneId,
    unit: unitTwo._id,
    owner: userOneId,
    name: 'sugar',
    totalUnitAmount: 10 * unitTwo.conversion,
    price: 10.99,
    unitPrice: 10.99 / (10 * unitTwo.conversion),
}

export const materialTwo = {
    _id: materialTwoId,
    unit: unitTwo._id,
    owner: userOneId,
    name: 'milk',
    totalUnitAmount: 5 * unitTwo.conversion,
    price: 5.99,
    unitPrice: 5.99 / (5 * unitOne.conversion),
}

export const materialThree = {
    _id: materialThreeId,
    unit: unitThree._id,
    owner: userTwoId,
    name: 'starch',
    totalUnitAmount: 10 * unitThree.conversion,
    price: 12.99,
    unitPrice:  12.99 / (10 * unitOne.conversion),
}

export const validMaterial = {
    unit: unitTwo._id,
    owner: userOneId,
    name: 'valid material',
    totalUnitAmount: 1000,
    price: 15.00,
    unitPrice: 15/ 1000,
}

export const invalidMaterial = {
    unit: unitOne._id,
    owner: userOneId,
    name: 'invalid material',
    price: 15.00,
    unitPrice: 15/1000,
}

// ================================
// RECEIPES
// ================================
export const recipeOne = {
    _id: new mongoose.Types.ObjectId,
    name: 'Receipe One',
    description: 'Description for receipe one',
    items: [
        { materials: materialOneId, amount: 200, cost: 4.99 },
        { materials: materialTwoId, amount: 300, cost: 6.99 },
    ],
    total: 135,
    owner: userOneId,
}

export const recipeTwo = {
    _id: new mongoose.Types.ObjectId,
    name: 'Receipe Two',
    description: 'Description for receipe two',
    items: [
        { materials: materialOneId, amount: 200, cost: 4.99 },
    ],
    total: 150,
    owner: userOneId,
}

export const recipeThree = {
    _id: new mongoose.Types.ObjectId,
    name: 'Receipe Three',
    description: 'Description for receipe three',
    items: [
        { materials: materialOneId, amount: 200, cost: 4.99 },
        { materials: materialTwoId, amount: 300, cost: 6.99 },
        { materials: materialThreeId, amount: 500, cost: 10.99 },
    ],

    total: 200,
    owner: userTwoId,
}

export const validRecipe = {
    name: 'Valid Receipe',
    description: 'Description for valid receipe',
    items: [
        { materials: materialOneId, amount: 200, cost: 4.99 },
        { materials: materialTwoId, amount: 300, cost: 6.99 },
        { materials: materialThreeId, amount: 500, cost: 10.99 },
    ],
    total: 200,
}

export const invalidRecipe = {
    name: 'Receipe Three',
    description: 'Description for receipe three',
    items: [
        { materials: materialOneId, cost: 4.99 },
        { materials: materialTwoId, amount: 300 },
        { amount: 500, cost: 10.99 },
    ],
    wrong: 'field'
}

export const generateAllData = async () => {
    await User.deleteMany()
    await Materials.deleteMany()
    await Units.deleteMany()
    await Recipe.deleteMany()

    await new User(userOneData).save()
    await new User(userTwoData).save()

    await Materials.insertMany([ materialOne,materialTwo, materialThree])
    await Units.insertMany([unitOne, unitTwo, unitThree])
    await Recipe.insertMany([recipeOne, recipeTwo, recipeThree])
}

export const closeDatabase = async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
}
