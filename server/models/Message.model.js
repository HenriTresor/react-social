import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        message: { text: { type: String, required: true } },
        users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }
    },
    {
        timestamps: true
    }
)

const Message = mongoose.model('message', messageSchema)

export default Message