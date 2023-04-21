import React, { useEffect, useState, useReducer, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

interface Props {
    children: ReactNode
}

export const AppData = React.createContext({})
const AppContext = (props: Props) => {

    const [users, setUsers] = useState([])
    const [pages, setPages] = useState([])
    const [currentUser, setCurrentUser] = useState({})
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const values = {
        users,
        isLoggedIn,
        currentUser,
        setUsers,
        pages,
        setPages,
        setCurrentUser,
        setIsLoggedIn
    }

    return (
        <AppData.Provider value={values}>
            {props.children}
        </AppData.Provider>
    )
}

export default AppContext