import { FC, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Profile: FC = () => {
    const { user, isLoggedIn } = useSelector(state => state.auth)
    const navigate = useNavigate()

    useEffect(() => {
        !isLoggedIn && navigate('/login')
    }, [isLoggedIn])
    return (
        <div>

            email {user?.email}
        </div>
    )
}

export default Profile