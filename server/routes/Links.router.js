import {createLink } from '../controllers/Links.controller.js'
import { Router } from 'express'

const router = Router()

router.post('/', createLink)

export default router