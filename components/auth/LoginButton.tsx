'use client'

import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { login, logout } from '../../store/userSlice'

export const LoginButton = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(state => state.user)

  const handleLogin = () => {
    dispatch(login({ 
      username: 'testuser', 
      email: 'test@example.com' 
    }))
  }

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <div>
      {user.isAuthenticated ? (
        <div className="flex flex-col gap-2">
          <span>Welcome, {user.username}!</span>
          <small>Login count: {user.loginCount}</small>
          <small>Last login: {new Date(user.lastLogin!).toLocaleString()}</small>
          <button onClick={handleLogout} 
                  className="bg-red-500 text-white px-4 py-2 rounded">
            Logout
          </button>
        </div>
      ) : (
        <button onClick={handleLogin}
                className="bg-blue-500 text-white px-4 py-2 rounded">
          Login
        </button>
      )}
    </div>
  )
}
