import e from "express";
import Page from "../models/pages.model.js";
import User from '../models/User.model.js'

export const getAllPages = async (req, res, next) => {
    try {
        let pages = await Page.find()

        return res.status(200).json({ status: true, pages })
    } catch (error) {
        console.log('error getting all pages', error.message);
        next(error);
    }
}

export const createPage = async (req, res, next) => {
    try {
        let { page_admin, page_name, page_category } = req.body

        if (!page_admin || !page_name || !page_category) return res.status(400).json({ status: false, message: "provide all required fields" })
        // check if admin is already a user

        let user = await User.findById(page_admin)
        if (!user) return res.status(404).json({ status: false, message: 'user was not found' })

        let newPage = new Page({
            page_name,
            page_admin: user._id,
            page_category,
        })

        await newPage.save()
        return res.status(201).json({ status: true, message: 'new page was created' })
    } catch (err) {
        console.log('err creating page', err.message);
        next(err)
    }

}
export const followPage = async (req, res, next) => {
    try {

        let { follower, pageId } = req.body

        // check if follower exists

        let user = await User.findById(follower)
        if (!user) return res.status(400).json({ status: false, message: 'follower was not found' })

        // check if page exists

        let page = await Page.findById(pageId)
        if (!page) return res.status(404).json({ status: false, message: 'page not found' })

        // check if user already follows this page

        if (page.page_followers.includes(user._id)) return res.status(409).json({ status: false, message: 'user already follows this page' })
        await Page.updateOne({ _id: page._id }, {
            $push: {
                page_followers: user._id
            }
        })

        return res.status(201).json({ status: true, message: 'follow added successfully' })
    } catch (err) {
        console.log('error following page', err.message);
        next(err)
    }
}


export const getPage = async (req, res, next) => {
    try {
        let { pageId } = req.params
        if (!pageId) return res.status(200).json({ message: 'id is required', status: false })
        let page = await Page.findById(pageId)
        if (!page) return res.status(404).json({ message: 'page not found', status: false })
        return res.status(200).json({ status: true, page })
    } catch (error) {
        console.log('error getting page', error.message);
        next(error)
    }
}