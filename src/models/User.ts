import mongoose, { Document, LeanDocument, Model, ObjectId, Schema } from "mongoose";
import bcrypt from 'bcryptjs'
import validator from 'validator'
import jwt, { Secret } from 'jsonwebtoken'

// User Interface
export enum Role {
    admin = 'admin',
    member = 'member'
}

export interface IUser extends Document{
    _id?: string,
    name: string,
    email: string,
    password: string,
    tokens: [{
        token: string
    }],
    last_login: Date,
    password_last_changed: Date,
    email_verified: boolean,
    isDisabled: boolean,
    disabledReason: string,
    profile_picture: string,
    role: string,
    // login_method: 
}

interface IUserDocument extends IUser {
    generateToken: () => Promise<string>
}

// Create User Schema
export const UserSchema: Schema<IUserDocument> = new Schema({
    name:  {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase:true,
        unique: true,
        validate(value: string) {
            if(!validator.isEmail(value)){
                throw new Error('Please enter a valid email')
            }
        }
    },
    password: {
        type: String,
        trim: true,
        minlength: 8,
        required: true,
    },
    tokens: [
        {
            token: {
                type: String,
                required:true,
            }
        }
    ],
    last_login: {
        type: Date,
        required: true,
        default: new Date()
    },
    password_last_changed: {
        type: Date,
        required: true,
        default: new Date()
    },
    email_verified: {
        type: Boolean,
        default: false,
        required: true,
    },
    isDisabled: {
        type: Boolean,
        default: false,
        required: true,
    },
    disabledReason:{
        type: String,
        default: '',
    },
    profile_picture: {
        type: String,
        default: '',
    },
    role: {
        type: String,
        enum: Role,
        default: Role.member,
        required: true
    },
    // login_method: {

    // }
}, {
    timestamps: true
})

UserSchema.virtual('recipes', {
    ref: 'Recipes',
    localField: '_id',
    foreignField: 'owner'
})

UserSchema.virtual('materials', {
    ref: 'Materials',
    localField: '_id',
    foreignField: 'owner'
})

UserSchema.methods.toJSON = function(){
    // Convert the user to an object
    const user = this.toObject() as Partial<LeanDocument<IUser & Document>>;

    // remove property thats for internal use
    delete user.password  // remove the password property off the object
    delete user.tokens // remove the tokens property off the object
    delete user.last_login // remove the last_login property
    delete user.password_last_changed  // remove the password_last_change property
    delete user.isDisabled // remove the isDisable property
    delete user.disabledReason // remove the disabledReason property
    delete user.role // remove the role property
    delete user.__v
    delete user._id
    return user // return the new object to the response
    
}

// generate the json web token
UserSchema.methods.generateToken = async function(){
    const user = this

    // Sign the token
    if(!process.env.JWT_SECRET){
        throw new Error('Invalid JWT')
    }

    const token = jwt.sign({_id: user.id}, process.env.JWT_SECRET as Secret, { expiresIn: '30 days'})

    // push the token into the array
    user.tokens.unshift({token})

    // save the user
    await user.save() 

    return token
}

// before saving
UserSchema.pre('save', async function(next){
    const user = this    // the user object which going to get save

    // hash the password
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

// Create a model 
const User = mongoose.model<IUserDocument>('User', UserSchema);

export default User