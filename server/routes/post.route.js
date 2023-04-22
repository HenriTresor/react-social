import { Router } from 'express'
import { createNewPost, getAllPosts, getSinglePost, getUserPosts, likePost } from '../controllers/post.controller.js'

const router = Router()

router.post('/', createNewPost)
router.get('/', getAllPosts)
router.get('/:postId', getSinglePost)
router.get('/user/:userId', getUserPosts)
router.post('/like', likePost)

export default router