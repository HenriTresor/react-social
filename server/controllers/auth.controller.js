import User from "../models/User.model.js";
import bcrypt from 'bcrypt'
import { createToken } from "../utils/jwt.js";

export const login = async (req, res, next) => {
    try {
        let { email, password } = req.body

        let user = await User.findOne({ email })
            .populate('friends')
            .populate('friendRequests')
            .populate('sentRequests');
        if (!user) return res.status(400).json({ status: false, message: 'invalid email or password' });

        // compare passwords

        let comparedPwd = await bcrypt.compare(password, user?.password)
        if (!comparedPwd) return res.status(400).json({ status: false, message: 'INVALID EMAIL ADDRESS OR PASSWORD' })

        return res.status(200).json({
            status: true,
            user,
            access_token: createToken(user._id)
        })
    } catch (error) {
        console.log('error logging in', error.message);
        next(error);
    }
}