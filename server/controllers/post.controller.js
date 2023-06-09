import Post from "../models/Post.model.js";
import User from "../models/User.model.js";

const checkUser = async (id) => {
    const user = await User.findById(id).select('-password')
    if (user) return true
    return false
}

export const createNewPost = async (req, res, next) => {
    try {
        console.log(req.body);
        let { author, post_content, image } = req.body
        if (!author || !post_content) return res.status(400).json({ status: false, message: 'author and post content is required' })
        let user = await checkUser(author)
        if (!user) return res.status(404).json({ status: 'false', message: 'user was not found' })

        let newPost = new Post({
            post_content: {
                text: post_content.text,
                image
            },
            author,

        })

        await newPost.save()
        return res.status(201).json({ status: true, message: 'post created', post: newPost })
    } catch (err) {
        console.log('error creating post', err.message);
        next(err)
    }
}
export const getAllPosts = async (req, res, next) => {
    try {
        let posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate('author')
            .populate('post_likes')
            .populate({
                path: 'post_comments',
                populate: {
                    path: 'user',
                    model: 'users'
                }
            })

        return res.status(200).json({ status: true, posts })
    } catch (err) {
        next(err)
    }
}
export const getSinglePost = async (req, res, next) => {
    try {
        let { postId } = req.params
        if (!postId) return res.status(400).json({ Status: false, message: 'post id is required' })

        let post = await Post.findById(postId)
            .populate('author')
            .populate('post_likes')
            .populate({
                path: 'post_comments',
                populate: {
                    path: 'user',
                    model: 'users'
                }
            })
        if (!post) return res.status(404).json({ status: false, message: 'post was not found' })
        return res.status(200).json({ status: true, post })
    } catch (err) {
        next(err)
    }
}
export const deletePost = async () => { }


export const getUserPosts = async (req, res, next) => {
    try {

        let { userId } = req.params
        if (!userId) return res.status(400).json({ status: false, message: 'user id is required' })
        let user = await checkUser(userId)
        if (!user) return res.status(400).json({ status: false, message: 'user was not found' })

        let userPosts = await Post.find({ author: { $all: userId } })
            .populate('author')
            .populate('post_likes')
            .populate('post_comments')

        return res.status(200).json({ status: true, userPosts })
    } catch (err) {
        next(err)
    }
}


export const likePost = async (req, res, next) => {
    try {
        let { userId, postId } = req.body
        if (!userId || !postId) return res.status(400).json({ status: false, message: 'person liking and post are required' })
        let user = await checkUser(userId)
        if (!user) return res.status(400).json({ status: false, message: 'user was not found' })
        let post = await Post.findById(postId)
        if (!post) return res.status(404).json({ status: false, message: 'post was not found' })

        // check if user doesn't already like the post
        if (post?.post_likes?.includes(userId)) return res.status(409).json({ status: false, message: 'user already likes the post' })

        await Post.updateOne({ _id: post?._id }, {
            $push: {
                post_likes: userId
            }
        })

        return res.status(201).json({ status: true, message: 'like added' })
    } catch (err) {
        console.log('error liking message');
        next(err)

    }
}


export const commentOnPosts = async (req, res, next) => {

    try {
        let { userId, comment } = req.body
        // console.log(req.body);
        let { postId } = req.params

        if (!userId || !comment || !postId) return res.status(400).json({ status: false, message: 'fill in the required fields' })

        // check if both exists

        let user = await checkUser(userId)
        if (!user) return res.status(400).json({ status: false, message: 'user was not found' })

        let post = await Post.findById(postId)
        if (!post) return res.status(400).json({
            status: false, message: 'post was not found'
        })

        await Post.updateOne({ _id: post._id }, {
            $push: {
                post_comments: {
                    user: userId,
                    comment: {
                        text: comment,
                        date: new Date(Date.now())
                    }
                }
            }
        })

        return res.status(201).json({ status: true, message: 'post added successfully' })
    } catch (err) {
        console.log('error commenting on post', err.message);
        next(err)
    }
}