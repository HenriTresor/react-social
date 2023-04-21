import mongoose from 'mongoose'

const pageSchema = new mongoose.Schema(
    {
        page_name: { type: String, required: true, trim: true },
        page_admin: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
        page_category: { type: String, required: true, trim: true },
        page_followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
        page_moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
        page_contents: [
            {
                content: {
                    text: String,
                    image: String
                },
                likes: [
                    {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'users'
                    }
                ],
                comments: [
                    {
                        comment: String,
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'users',
                        time: Date
                    }
                ]
            }
        ]
    },
    {
        timestamps: true
    }
)

const Page = mongoose.model('pages', pageSchema)

export default Page