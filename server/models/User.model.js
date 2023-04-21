import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const UserSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        names: { type: String, required: true, unique: false, trim: true },
        profile: { type: String, required: true, trim: true, default:"data:image/png;base64,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"},
        gender: { type: String, enum: ['male', 'female', 'custom'], trim: true, default: 'custom' },
        password: { type: String, required: true, minlength: 6, maxlength: 65 },
        friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
        friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users', unique:false }],
        sentRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users', unique:false }]
    },
    {
        timestamps: true,
    }
)

UserSchema.pre('save', async function () {
    try {
        let hashedPwd = await bcrypt.hash(this.password, 10)
        this.password = hashedPwd
    } catch (err) {
        console.log(err);
    }
})

const User = mongoose.model('users', UserSchema)

export default User