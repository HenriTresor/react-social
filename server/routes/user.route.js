import { Router } from "express";
import { createUser, getAllUsers, getUser, updateUser, deleteUser, getUserProfile } from '../controllers/user.controller.js'
import {upload} from '../index.js'
import { verifyToken } from "../utils/jwt.js";
const router = Router()

router.get('/', getAllUsers)
router.get('/:id', getUser)
router.post('/', createUser)
router.patch('/:id', updateUser)
router.delete('/:id', deleteUser)
router.get('/me/profile', verifyToken, getUserProfile)
export default router