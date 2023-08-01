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
                    default: 'bot'
                },
                message: {
                    text: String
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