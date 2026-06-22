import express from 'express';
import auth from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import * as ctrl from '../controllers/pet.controller.js';

const router = express.Router();

router.get('/', asyncHandler(ctrl.listPets));
router.get('/:id', asyncHandler(ctrl.getPet));
router.post('/', auth, asyncHandler(ctrl.createPet));
router.put('/:id', auth, asyncHandler(ctrl.updatePet));
router.delete('/:id', auth, asyncHandler(ctrl.deletePet));

export default router;
