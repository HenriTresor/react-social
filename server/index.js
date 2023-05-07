import express, { application } from 'express'
import mongoose from 'mongoose'
import { connection } from './configs/db.config.js'
import userRouter from './routes/user.route.js'
import friendsRouter from './routes/friends.route.js'
import messageRouter from './routes/message.route.js'
import pageRouter from './routes/page.route.js'
import authRouter from './routes/auth.route.js'
import postRoute from './routes/post.route.js'
import { v2 as cloudinary } from 'cloudinary'
import { config } from 'dotenv'
import multer from 'multer'
import { Server } from 'socket.io'
import cors from 'cors'
import http from 'http'
import { createClient } from 'redis'

const client = createClient({})
export const upload = multer({ dest: './uploads/' })

config()

cloudinary.config({
    secure: true,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME
})

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: '*'
    }
})

const PORT = process.env.PORT || 8080


connection.then(() => {
    console.log('connected to mongoose');
}).then(() => {
    server.listen(PORT, () => {
        console.log(`server listening on port ${PORT}`);
    })
}).catch(err => console.log(`error connecting to mongoose ${err.message}`));

app.use(cors())
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
app.use(`${rootRoute}/posts`, postRoute)

app.all('*', (req, res) => {
    res.status(400).json({ message: 'resource not found' })
})

// error handler

app.use((err, req, res, next) => {
    if (err) return res.status(500).json({ status: false, message: err.message });
})


let onlineUsers = []
io.on('connection', (socket) => {
    console.log(`${socket.id}`);

    socket.on('add user', user => {
        console.log(user);
        onlineUsers.push({ ...user, socketId: socket.id });
    })

    // socket.emit('online users', onlineUsers)
    setInterval(() => {
        socket.emit('online users', onlineUsers)
    }, 3000)

    socket.on('show is typing', user => {
        let receiver = onlineUsers?.find(onlineUser => onlineUser?._id === user?._id)
        if (receiver) {
            socket.to(receiver?.socketId).emit('is-typing')
        }
    })
    socket.on('add message', message => {
        // console.log(message);

        let receiver = onlineUsers.find(user => user?._id === message?.receiver?._id)
        if (receiver) {
            console.log('reciver', receiver);
            socket.to(receiver.socketId).emit('new message', message)
        }
    })
    socket.on('disconnect', () => {
        onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id)
        console.log(`${socket.id} disconnected`);
    })
})

export default app