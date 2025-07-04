import { Request, Response } from "express"


/* 
export const getInvoiceById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const invoice = await Invoice.findById(id);

        if (!invoice) {
            res.status(404).json({ message: 'Factura no encontrada' });
            return;
        }

        res.status(200).json({ message: 'Factura encontrada', invoice });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al buscar la factura' });
    }
};

export const newInvoice = async (req: Request, res: Response) =>{
    const { products, totalAmount, invoiceNumber, customerName, customData } = req.body
    console.log(invoiceNumber);
    console.log(customerName);
    try {
        const newInvoice  = new Invoice({ invoiceNumber, customerName, products, totalAmount, customData})
        await newInvoice.save()
        res.status(200).json({message:'Invoice created', data: newInvoice})
    } catch (error) {
        res.status(500).json({message: 'Error saving invoice', error})
    }
} */