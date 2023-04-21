import Message from "../models/Message.model.js";

export const addMessage = async (req, res, next) => {
    try {
        let { sender, receiver, message } = req.body
        if (!sender || !receiver || !message) return res.status(400).json({ status: false, message: 'sender, receiver and message content are all required' })

        let newMsg = new Message({
            message: { text: message },
            users: [sender, receiver],
            sender
        })

        await newMsg.save()
        return res.status(201).json({ status: true, message: 'new message saved' })
    } catch (error) {
        console.log('error adding message', error.message);
        next(error);
    }
}

export const getMessages = async (req, res, next) => {
    try {

        let { users } = req.body
        if (!users) return res.status(400).json({ status: false, message: 'users are required to get their messages' })

        let messages = await Message.find({ users: { $all: [...users] } }).populate('users').populate('sender')
        return res.status(200).json({ status: false, messages })
    } catch (error) {
        console.log('error getting messages', error.message);
        next(error)
    }
}

export const deleteMessage = async (req, res, next) => {

}