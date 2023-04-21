import User from '../models/User.model.js'
import { v2 as cloudinary } from 'cloudinary'
import { createToken } from '../utils/jwt.js';

export const createUser = async (req, res, next) => {
    try {
        const { email, password, names, gender } = req.body;
        if (!email || !password || !names) return res.status(400).json({ status: false, message: 'email, password and names must be provided' })

        // check if user already exists
        let user = await User.findOne({ email }).select('-password')
        if (user) return res.status(400).json({ status: false, message: `${email} already exists` })

        // save the user into database

        let newUser = new User({
            email,
            names,
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
        let user = await User.findById(id).select('-password')
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