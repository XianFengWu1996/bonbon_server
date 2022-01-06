import mongoose, { LeanDocument, Schema } from "mongoose";

export interface IReceipt {
    _id?: string,
    receiptName: string, 
    customerName: string, 
    customerPhone: string, 
    pickupDate: string, 
    total: number,
    merchantCartQuantity: number,
    merchants: [IMerchantItem],
    owner: string, 
}

export interface IMerchantItem {
    name: string,
    unit: string,
    quantity: number,
    unitPrice: number,
    totalPrice: number,
}

export const MerchantItemSchema: Schema<IMerchantItem> = new Schema({
    name: {
        type: String,
        required: true,
    },
    unit: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 0,
    },
    unitPrice: {
        type: Number,
        required: true,
        min: 0,
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0,
    },
})

export const ReceiptSchema: Schema<IReceipt> = new Schema({
    receiptName: {
        type: String, 
        required: true,
    },
    customerName: {
        type: String, 
        required: true,
    },
    customerPhone: {
        type: String, 
        required: true,
    },
    pickupDate: {
        type: String, 
        required: true,
    },
    total: {
        type: Number, 
        required: true,
        min: 0,
    },
    merchantCartQuantity: {
        type: Number, 
        required: true,
        min: 0,
    },
    merchants: {
        type: [MerchantItemSchema], 
        required: true,
    },
    owner: {
        type: String, 
        required: true,
    }
}, {timestamps: true})

ReceiptSchema.methods.toJSON = function (){
    const receipt = this.toObject() as Partial<LeanDocument<IReceipt & Document>>;
    delete receipt.owner;

    return receipt;
}

const Receipt = mongoose.model('Receipt', ReceiptSchema);

export default Receipt;