import express from 'express';
import auth from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import * as ctrl from '../controllers/user.controller.js';

const router = express.Router();

router.post('/register', asyncHandler(ctrl.registerUser));
router.post('/login', asyncHandler(ctrl.loginUser));
router.get('/me', auth, asyncHandler(ctrl.getMe));
router.get('/', asyncHandler(ctrl.listUsers));
router.get('/:id', asyncHandler(ctrl.getUser));
router.put('/:id', auth, asyncHandler(ctrl.updateUser));

export default router;
