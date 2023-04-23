import { request } from "express";
import User from "../models/User.model.js";

export const getUserFriends = async (req, res, next) => {
    try {
        let { userId } = req.params
        if (!userId) return res.status(400).json({ status: false, message: 'user id is required' })
        // check if user exists
        let user = await User.findById(userId);
        if (!user) return res.status(404).json({ status: false, message: 'user was not found' });
        let userFriends = user.friends
        return res.status(200).json({ status: true, userFriends })
    } catch (error) {
        console.log('error getting user friends:', error.message);
        next(error)
    }
}

export const sendFriendRequest = async (req, res, next) => {
    try {
        let { userId } = req.params
        if (!userId) return res.status(400).json({ status: false, message: 'user id is required' })

        // check if user exists
        let user = await User.findById(userId);
        if (!user) return res.status(404).json({ status: false, message: 'user was not found' });

        let { requestId } = req.body;
        if (!requestId) return res.status(404).json({ status: false, message: 'requestId is required' });

        // check if requested user exists
        let requestedUser = await User.findById(requestId);
        if (!requestedUser) return res.status(404).json({ status: false, message: 'requested user was not found' });

        if (userId === requestId) return res.status(400).json({ status: false, message: 'user cannot befriend themselves' })

        // check if the request already exists

        if (requestedUser.friendRequests.includes(userId)) return res.status(400).json({ status: false, message: 'request already sent' })

        // check if request already sent

        if (user.sentRequests.includes(requestId)) return res.status(400).json({ status: false, message: 'request already sent' })

        // check if they are already friends

        if (user.friends.includes(requestId) || requestedUser.friends.includes(userId)) return res.status(400).json({ status: false, message: 'users are already friends' })

        await User.updateOne({ _id: requestedUser._id }, {
            $push: {
                friendRequests: user._id
            }
        })

        await User.updateOne({ _id: user._id }, {
            $push: {
                sentRequests: requestedUser._id
            }
        })
        return res.status(201).json({ status: true, message: 'request sent successfully' })
    } catch (error) {
        console.log('error adding friend:', error.message);
        next(error)
    }
}


export const acceptRequest = async (req, res, next) => {
    try {
        let { userId } = req.params;
        let { requesterId } = req.body

        if (!userId || !requesterId) return res.status(400).json({ status: false, message: 'current user id and requester id is required' })

        // check if both users exists

        let user = await User.findById(userId)
        let requester = await User.findById(requesterId)

        if (!user || !requester) return res.status(404).json({ status: false, message: 'some users were not found' })

        // check if they are already friends
        if (user.friends.includes(requesterId) || requester.friends.includes(userId)) {
            await User.findByIdAndUpdate(user._id, {
                $pull: {
                    friendRequests: requester._id,
                },

            })

            await User.findByIdAndUpdate(requester._id, {
                $pull: {
                    sentRequests: user._id,
                },
            })
            return res.status(400).json({ status: false, message: 'users are already friends' })
        }

        // check if request exists
        if (!user.friendRequests.includes(requesterId) || !requester.sentRequests.includes(userId)) return res.status(400).json({ status: false, message: 'no request between users' })
        await User.findByIdAndUpdate(user._id, {
            $pull: {
                friendRequests: requester._id,
            },
            $push: {
                friends: requester._id
            }
        })

        await User.findByIdAndUpdate(requester._id, {
            $pull: {
                sentRequests: user._id,
            },
            $push: {
                friends: user._id
            }
        })

        return res.status(201).json({ status: true, message: 'request accepted' })
    } catch (error) {
        console.log('error accepting request:', error.message);
        next(error)
    }
}

export const removeFriend = async (req, res, next) => {
    try {
        let { userId } = req.params
        let { friendToRemoveId } = req.body
        if (!userId || !friendToRemoveId) return res.status(400).json({ status: false, message: 'current user id and friend-to-remove id is required' });

        // check if both users exists

        let user = await User.findById(userId)
        let friendToDelete = await User.findById(friendToRemoveId)

        if (!user || !friendToDelete) return res.status(400).json({ status: false, message: 'some users requested are missing' })

        // check if they are friends

        if (!user.friends.includes(friendToDelete._id) || !friendToDelete.friends.includes(user._id)) return res.status(400).json({ status: false, message: 'users are not friends' })
        await User.updateOne({ _id: user._id }, {
            $pull: {
                friends: friendToDelete._id
            }
        })

        await User.updateOne({ _id: friendToDelete._id }, {
            $pull: {
                friends: user._id
            }
        })

        return res.status(200).json({ status: true, message: 'friend removed successfully' })
    } catch (err) {
        console.log('error removing friend: ' + err.message);
        next(err);
    }
}