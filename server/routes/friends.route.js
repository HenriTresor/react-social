import { Router } from "express";
import { acceptRequest, getUserFriends, removeFriend, sendFriendRequest } from '../controllers/friends.controller.js'

const router = Router()

router.get('/:userId', getUserFriends)
router.post('/:userId', sendFriendRequest)
router.patch('/:userId', acceptRequest)
router.delete('/:userId', removeFriend)
export default router