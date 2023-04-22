import mongoose from 'mongoose'

const postSchema = new mongoose.Schema(
    {
        post_content: {
            text: { type: String },
            image: { type: String },
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true,
            trim: true
        },
        post_likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users'
            },
        ],
        post_comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users'
            }
        ]
    },
    {
        timestamps: true
    }
)


const Post = mongoose.model('posts', postSchema)

export default Post