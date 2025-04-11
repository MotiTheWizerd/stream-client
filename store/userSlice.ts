import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
  isAuthenticated: boolean
  username: string | null
  email: string | null
  lastLogin: string | null
  loginCount: number
  stats: {
    totalSessions: number
    lastActive: string | null
  }
}

const initialState: UserState = {
  isAuthenticated: false,
  username: null,
  email: null,
  lastLogin: null,
  loginCount: 0,
  stats: {
    totalSessions: 0,
    lastActive: null
  }
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ username: string; email: string }>) => {
      state.isAuthenticated = true
      state.username = action.payload.username
      state.email = action.payload.email
      state.lastLogin = new Date().toISOString()
      state.loginCount += 1
      state.stats.totalSessions += 1
      state.stats.lastActive = new Date().toISOString()
      
      console.log('User Stats:', {
        username: state.username,
        email: state.email,
        loginCount: state.loginCount,
        lastLogin: state.lastLogin,
        totalSessions: state.stats.totalSessions
      })
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.username = null
      state.email = null
    }
  }
})

export const { login, logout } = userSlice.actions
export default userSlice.reducer
