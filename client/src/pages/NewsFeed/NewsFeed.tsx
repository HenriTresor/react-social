// import React from 'react'
import Body from "../../components/Body/Body"
import Header from "../../components/Header/Header"



const NewsFeed = ({allUsers, posts, isLoading}) => {
    return (
        <>
            <Body allUsers={allUsers} posts={posts} isLoading={ isLoading} />
        </>
    )
}

export default NewsFeed