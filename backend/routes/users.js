import express from 'express';
import { register, login, logout, join, tree } from '../controllers/Post.js';
import { protectRoute } from '../utils/authmiddleware.js'
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.post('/join', protectRoute, join);
router.get('/tree/:id', protectRoute, tree);
//router

export default router;