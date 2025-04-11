import { configureStore, Middleware } from '@reduxjs/toolkit'
import userReducer from './userSlice'

// Custom middleware for logging state changes
const stateLogger: Middleware = store => next => action => {
  const result = next(action)
  if (action.type.startsWith('user/')) {
    console.log('State after user action:', store.getState().user)
  }
  return result
}

// Create store function
function makeStore() {
  return configureStore({
    reducer: {
      user: userReducer,
    },
    middleware: (getDefault) => getDefault().concat(stateLogger)
  })
}

// Type inference
export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

// Create store instance
let storeInstance: AppStore | undefined

// Initialize store with singleton pattern
export function initializeStore() {
  let _store = storeInstance ?? makeStore()

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store

  // Create the store once in the client
  if (!storeInstance) storeInstance = _store

  return _store
}

// Initialize store
const store = initializeStore()
export default store
