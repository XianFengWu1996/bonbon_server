import mongoose, { Schema } from 'mongoose'

export interface IUnit {
    name: string,
    chinese: string,
    shortHand: string,
    conversion: number,
    needsConversion: boolean    
}

export const unitSchema: Schema<IUnit> = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        lowercase: true,
    },
    chinese: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        lowercase: true,
    },
    shortHand: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        lowercase: true,
    },
    conversion: {
        type: Number,
        required: true,
        minlength: 1,
    },
    needsConversion: {
        type: Boolean,
        required: true,
        default: true,
    },
})

unitSchema.virtual('material', {
    localField: '_id',
    ref: 'Materials',
    foreignField: 'unit'
})



const Units = mongoose.model('Units', unitSchema)

export default Units