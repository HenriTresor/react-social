import React, { useEffect, useState, useReducer } from 'react'
import { serverLink } from '../utils/links'
import { useNavigate } from 'react-router-dom'

export const AppData = React.createContext()
const AppContext = ({ children }) => {

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
      {children}
    </AppData.Provider>
  )
}

export default AppContext