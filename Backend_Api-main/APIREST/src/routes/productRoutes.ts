import { Router } from "express";
import { buyProductsStrapi, createProductInStrapi, getAllProductsStrapi, getProductFromStrapi, updateProductInStrapi } from "../controllers/productController";
import { getUserIdFromToken } from "../middlewares/userFromToken";
const router = Router()

router.get('/', getUserIdFromToken, getAllProductsStrapi)

router.get('/:productId', getUserIdFromToken, getProductFromStrapi)

router.post('/', getUserIdFromToken, createProductInStrapi);

router.post('/buyProducts', buyProductsStrapi)

router.put('/:id', updateProductInStrapi);


export default router;