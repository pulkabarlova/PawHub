import express from 'express';
import auth from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import * as ctrl from '../controllers/event.controller.js';

const router = express.Router();

router.get('/', asyncHandler(ctrl.listEvents));
router.get('/:id', asyncHandler(ctrl.getEvent));
router.post('/', auth, asyncHandler(ctrl.createEvent));
router.put('/:id', asyncHandler(ctrl.updateEvent));
router.delete('/:id', asyncHandler(ctrl.deleteEvent));

export default router;
