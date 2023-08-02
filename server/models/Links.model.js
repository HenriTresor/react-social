import mongoose from "mongoose";

const LinkSchema = new mongoose.Schema(
    {
        users: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users'
            }
        ],
        messages: [
            {
                sender: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'users',
                },
                message: {
                    text: String
                },
                receiver: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'users',
                }
            }
        ]
    },
    {
        timestamps: true
    }
)

const Link = mongoose.model('links', LinkSchema)

export default Link