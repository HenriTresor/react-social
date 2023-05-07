import React from 'react'
import { useNavigate } from 'react-router-dom'

const Homepage = () => {

    const navigate = useNavigate()
    React.useEffect(() => {
        navigate('/newsfeed')
    },[])
  return (
    <div>Homepage</div>
  )
}

export default Homepage