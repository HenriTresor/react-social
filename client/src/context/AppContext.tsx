import React, { useEffect, useState, useReducer, ReactNode } from 'react'

interface Props {
    children: ReactNode
}

export const AppData = React.createContext({})
const AppContext = (props: Props) => {

    const [users, setUsers] = useState([])
    const [pages, setPages] = useState([])
    const [currentUser, setCurrentUser] = useState(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [posts, setPosts] = useState([])
    const [pageWidth, setPageWidth] = useState(0)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    useEffect(() => {
        setPageWidth(window.innerWidth)
    }, [])

    const handleSize = () => {
        setPageWidth(window.innerWidth)
    }
    useEffect(() => {
        window.addEventListener('resize', handleSize)
        return () => window.removeEventListener('resize', handleSize)
    }, [])

    useEffect(() => {
        console.log(pageWidth);

    }, [pageWidth])
    const values = {
        users,
        isLoggedIn,
        currentUser,
        setUsers,
        pages,
        setPages,
        setCurrentUser,
        setIsLoggedIn,
        posts,
        setPosts,
        pageWidth,
        isDrawerOpen,
        setIsDrawerOpen,
        isModalOpen,
        setIsModalOpen
    }

    return (
        <AppData.Provider value={values}>
            {props.children}
        </AppData.Provider>
    )
}

export default AppContext