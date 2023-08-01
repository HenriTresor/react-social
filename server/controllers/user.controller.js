import User from '../models/User.model.js'
import { v2 as cloudinary } from 'cloudinary'
import { createToken } from '../utils/jwt.js';

const defaultAvatar = 'data:image/png;base64,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'

export const createUser = async (req, res, next) => {
    try {
        console.log(req.body);
        const { email, password, names, gender, profile } = req.body;
        if (!email || !password || !names) return res.status(400).json({ status: false, message: 'email, password and names must be provided' })

        // check if user already exists
        let user = await User.findOne({ email }).select('-password')
        if (user) return res.status(400).json({ status: false, message: `${email} already exists` })

        // save the user into database

        let newUser = new User({
            email,
            names,
            profile: profile !== '' ? profile : defaultAvatar,
            gender,
            password,
        })

        await newUser.save()
        const token = createToken(newUser._id)
        return res.status(201).json({
            status: true,
            message: 'new account has been created',
            user: {
                profile: newUser.profile,
                _id: newUser._id,
                email: newUser.email,
                names: newUser.names,
                gender: newUser.gender,
                friends: newUser.friends,
                friendRequests: newUser.friendRequests
            },
            access_token: token,
        })
    } catch (err) {
        console.log('error creating user: ' + err.message);
        next(err)
    }
}
export const getAllUsers = async (req, res, next) => {
    try {

        let { currentUserId } = req.query
        let users = await User.find().select('-password').populate('friends').populate('friendRequests').populate('sentRequests');
        if (users.length > 0) return res.status(200).json({ status: true, users: users.filter(user => user?._id !== currentUserId) })
        return res.status(200).json({ status: true, message: 'no users found' })
    } catch (err) {
        console.log('error getting users: ' + err.message);
        next(err)
    }
}

export const getUser = async (req, res, next) => {
    try {
        let { id } = req.params
        if (!id) return res.status(400).json({ status: false, message: 'user id is required' });
        let user = await User.findById(id).select('-password').populate('friends')
        if (!user) return res.status(404).json({ status: false, message: 'user was not found' });
        return res.status(200).json({ status: true, user })

    } catch (error) {
        console.log('error getting user', error.message);
        next(error)
    }
}
export const updateUser = async (req, res, next) => {
    try {
        let { id } = req.params
        if (!id) return res.status(400).json({ status: false, message: 'user id is required' });
        if (!req.body) return res.status(400).json({ status: 'false', message: 'update data is required' })
        await User.findByIdAndUpdate(id, { $set: { ...req.body } })
        return res.status(201).json({ status: true, message: 'user was updated successfully' });
    } catch (error) {
        next(error)
    }
}
export const deleteUser = async (req, res, next) => {
    try {
        let { id } = req.params
        if (!id) return res.status(400).json({ status: false, message: 'user id is required' });
        const userToDelete = await User.findById(id)
        if (!userToDelete) return res.status(404).json({ status: false, message: 'user was not found' });
        await userToDelete.deleteOne();
        return res.status(200).json({ status: true, message: 'account was removed successfully' })
    } catch (err) {
        console.log('error deleting user', err.message);
        next(err)
    }
}


export const getUserProfile = async (req, res, next) => {
    try {
        let { userId } = req
        console.log(userId)
        let currentUser = await User.findById(userId).select('-password')
            .populate('friends')
            .populate('friendRequests')
            .populate('sentRequests')

        if (!currentUser) return res.status(404).json({ status: false, message: 'user was not found' });
        res.status(200).json({ status: true, currentUser })
    } catch (err) {
        next(err)
    }
}