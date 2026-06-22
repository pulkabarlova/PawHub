import express from 'express';
import auth from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import * as ctrl from '../controllers/post.controller.js';

const router = express.Router();

router.get('/', asyncHandler(ctrl.listPosts));
router.get('/:id', asyncHandler(ctrl.getPost));
router.post('/', auth, asyncHandler(ctrl.createPost));
router.put('/:id', auth, asyncHandler(ctrl.updatePost));
router.delete('/:id', auth, asyncHandler(ctrl.deletePost));

export default router;
