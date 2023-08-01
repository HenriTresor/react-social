import Link from "../models/Links.model.js";

export const createLink = async (req, res, next) => {

    try {

        let { users, message } = req.body
        if (!users) return res.status(400).json({ status: false, message: 'users are required to create links' })

        let newLink = new Link({
            users,
            messages: []
        })

        await newLink.save()

        res.status(201).json({ status: true, message: 'new link saved', link: newLink })
    } catch (error) {
        console.log('error creating link', error.message)
        res.status(500).json({ status: false, message: 'error occurred' })
    }
} 