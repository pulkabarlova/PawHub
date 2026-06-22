import express from 'express';
import auth from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import * as ctrl from '../controllers/product.controller.js';

const router = express.Router();

router.get('/', asyncHandler(ctrl.listProducts));
router.get('/:id', asyncHandler(ctrl.getProduct));
router.post('/', auth, asyncHandler(ctrl.createProduct));
router.put('/:id', asyncHandler(ctrl.updateProduct));
router.delete('/:id', asyncHandler(ctrl.deleteProduct));

export default router;
