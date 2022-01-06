import mongoose, { Schema } from 'mongoose'
import { IUnit, unitSchema } from './Unit'

export interface IMaterial{
    unit: string,   // contain information for conversion

    // information for the materials
    name: string,  // name of the material
    owner: string,  // id of the owner to assoicate the material to
    totalUnitAmount: number, // total unit amount after conversion
    price: number, // price of the material 
    unitPrice: number, // unit per dolar of the material
}

export const MaterialSchema: Schema<IMaterial> = new Schema({
    unit: {
        type: String,
        required: true,
        ref: 'Units'
    },
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        minlength: 1
    },
    totalUnitAmount: {
        type: Number,
        required: true,
        minlength: 0,
    },
    price: {
        type: Number,
        required: true,
        minlength: 0,
    },
    unitPrice: {
        type: Number, 
        required: true,
        minlength: 0,
    },
    owner: {
        type: String,
        required: true,
        ref: 'User'
    },
})

MaterialSchema.virtual('recipes', {
    ref: 'Recipes',
    localField: '_id',
    foreignField: 'materials'
})

const Materials = mongoose.model('Materials', MaterialSchema)

export default Materials