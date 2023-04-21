import { addMessage, getMessages, deleteMessage} from '../controllers/message.controller.js'
import { Router } from 'express'

const router = Router()

router.post('/addmsg', addMessage)
router.post('/', getMessages)
router.delete('/', deleteMessage)

export default router