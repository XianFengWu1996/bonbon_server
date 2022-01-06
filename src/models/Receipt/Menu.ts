import mongoose, { Document, LeanDocument, Schema } from 'mongoose'

export interface IUnitOption {
    _id?: string | mongoose.Schema.Types.ObjectId,
    unit: string,
    price: number,
}

export interface IItemOptions {
    _id?: string | mongoose.Schema.Types.ObjectId,
    flavor: string,
    unitOption: IUnitOption[]
}

export interface IMenuItem {
    _id?: string,
    name: string, 
    options: IItemOptions[]
}

export interface IMenu extends Document{
    menu: IMenuItem[], 
    owner: string,
}

export const UnitOptionSchema:Schema<IUnitOption> = new Schema({
    unit: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    }
})

export const ItemOptionsSchema:Schema<IItemOptions> = new Schema({
    flavor: {
        type: String,
        required: true
    },
    unitOption: {
        type: [UnitOptionSchema]
    }
});

export const MenuItemSchema: Schema<IMenuItem> = new Schema({
    name: {
        type: String,
        required: true,
        toUpperCase: true,
        trim: true,
        validate: {
            validator: (v: string) => {
                if(!v || v.length == 0){
                    return false
                }
            },
            message: 'Missing Field (name)'
        }
    },
    options: {
        type: [ItemOptionsSchema]
    }
})

export const MenuSchema: Schema<IMenu> = new Schema({
    menu: {
        type: [MenuItemSchema]
    },
    owner: {
        type: String,
        required: true,
        ref: 'User'
    }
}, {
})

MenuSchema.methods.toJSON = function (){
    const menu = this.toObject() as Partial<LeanDocument<IMenu & Document>>;
    delete menu.owner;
    delete menu.__v;

    return menu;
}

const Menu = mongoose.model<IMenu>('Menu', MenuSchema);

export default Menu;
