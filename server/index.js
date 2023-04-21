import express, { application } from 'express'
import mongoose from 'mongoose'
import { connection } from './configs/db.config.js'
import userRouter from './routes/user.route.js'
import friendsRouter from './routes/friends.route.js'
import messageRouter from './routes/message.route.js'
import pageRouter from './routes/page.route.js'
import authRouter from './routes/auth.route.js'
import { v2 as cloudinary } from 'cloudinary'
import { config } from 'dotenv'
import multer from 'multer'
import cors from 'cors'

export const upload = multer({ dest: './uploads/' })

config()

cloudinary.config({
    secure: true,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME
})

const app = express()

const PORT = process.env.PORT || 8080

const logger = (req, res, next) => {
    console.log(`${req.url}`);
    next()
}

connection.then(() => {
    console.log('connected to mongoose');
}).then(() => {
    app.listen(PORT, () => {
        console.log(`server listening on port ${PORT}`);
    })
}).catch(err => console.log(`error connecting to mongoose ${err.message}`));

app.use(cors())
app.use(logger)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// routes
app.get('/', (req, res) => {
    res.sendStatus(204);
})

const rootRoute = '/api'

app.use(`${rootRoute}/users`, userRouter)
app.use(`${rootRoute}/friends`, friendsRouter)
app.use(`${rootRoute}/messages`, messageRouter)
app.use(`${rootRoute}/pages`, pageRouter)
app.use(`${rootRoute}/auth`, authRouter)

app.all('*', (req, res) => {
    res.status(400).json({ message: 'resource not found' })
})

// error handler

app.use((err, req, res, next) => {
    if (err) return res.status(500).json({ status: false, message: err.message });
})

export default app