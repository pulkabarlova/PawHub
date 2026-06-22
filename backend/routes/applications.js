import express from 'express';
import auth from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import * as ctrl from '../controllers/application.controller.js';

const router = express.Router();

router.get('/me', auth, asyncHandler(ctrl.myApplications));
router.post('/', auth, asyncHandler(ctrl.applyForAdoption));
router.delete('/:id', auth, asyncHandler(ctrl.cancelApplication));

export default router;
