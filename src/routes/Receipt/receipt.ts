import { Request, Response, Router } from 'express'
import { auth } from '../../middleware/auth';
import Receipt, { IReceipt } from '../../models/Receipt/Receipt';

const router = Router();

const validateReceiptData = (receipt: IReceipt) => {
    if(!receipt.customerName){
        throw new Error('Customer name is required')
    }

    if(!receipt.customerPhone){
        throw new Error('Customer phone is required')
    }

    if(!receipt.pickupDate){
        throw new Error('Pick up date is required')
    }

    if(!receipt.receiptName){
        throw new Error('Receipt name is required')
    }

    if(!receipt.total){
        throw new Error('Total is required')
    }

    if(!receipt.merchantCartQuantity){
        throw new Error('Cart quantity is required')
    }

    if(!receipt.merchants){
        throw new Error('Merchant items are required')
    }
}

router.get('/receipt', auth, async(req: Request, res: Response) => {
    try {
        const receipts = await Receipt.find({ owner: req.user?._id }).sort({ 'createdAt': -1});

        res.status(200).send({ receipts });
    } catch (error) {
        res.status(400).send({ error: (error as Error).message});
    }
});

router.post('/receipt', auth, async(req: Request, res: Response) => {
    try {
        const { receipt } : { receipt: IReceipt} =  req.body;
            
        validateReceiptData(receipt);

        const newReceipt = await Receipt.create({ ...receipt, owner: req.user?._id });

        res.status(200).send({receipt: newReceipt});
    } catch (error) {
        console.log(error);
        res.status(400).send({ error: (error as Error).message});
    }
});

router.patch('/receipt/:id', auth, async(req: Request, res: Response) => {
    try {
        validateReceiptData(req.body.receipt);

        const receipt = await Receipt.findOne({ _id: req.params.id, owner: req.user?._id});

        if(!receipt ){
            res.status(404).send({ error: 'Not found'})
        }

        Object.assign(receipt, req.body.receipt);

        await receipt?.save()

        res.status(200).send({ receipt });

    } catch (error) {
        res.status(400).send({ error: (error as Error).message})
    }
});

router.delete('/receipt/:id', auth, async(req: Request, res: Response) => {
     try {
        const receipt = await Receipt.findOneAndRemove({
            owner: req.user?._id,
            _id: req.params.id
        });

        if(!receipt){
            return res.status(404).send({ error: 'Not Found'})
        }

        res.status(200).send({ receipt })
    } catch (error) {
        res.status(400).send({ error: (error as Error).message});
    }
});


export default router;