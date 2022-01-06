import mongoose, { Schema } from 'mongoose'
import { MaterialSchema } from './Material'


export interface IRecipe {
    name: string,
    description: string,
    items: [{
            materials: string, // contain id of the materials
        }],
    total: number,
    owner: string,
}

export const RecipeSchema: Schema<IRecipe> = new Schema({
    name: {
        type: String,
        default: 'Untitle',
    },
    description: {
        type: String,
        default: ''
    },
    items: {
        type: [
            {
                materials: {
                    type: String,
                    required: true,
                    ref: 'Materials'
                },
                amount: {
                    type: Number,
                    required: true,
                },
                cost: {
                    type: Number,
                    required: true,

                }
            }
        ]
    },
    total: {
        type: Number,
        default: 0,
        minlength: 0,
    }, 
    owner: {
        type: String,
        required: true,
        ref: 'User'
    }
}, {timestamps: true})

const Recipe = mongoose.model('Recipes', RecipeSchema)

export default Recipe
