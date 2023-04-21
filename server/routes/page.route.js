import { Router } from 'express'
import { createPage, followPage, getAllPages, getPage } from '../controllers/page.controller.js'

const router = Router()

router.get('/', getAllPages)
router.get('/:pageId', getPage)
router.post('/', createPage)
router.put('/', followPage)

export default router