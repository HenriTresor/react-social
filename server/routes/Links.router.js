import { createLink, getUserLinks } from '../controllers/Links.controller.js'
import { Router } from 'express'

const router = Router()

router.post('/', createLink)
router.get('/:userId', getUserLinks)

export default router