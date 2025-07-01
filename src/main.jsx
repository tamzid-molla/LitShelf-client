import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ThemeContext } from './context/ThemeContext.jsx'
import { RouterProvider } from 'react-router'
import router from './route/Router.jsx'
import { FirebaseContext } from './context/FirebaseContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* The following renders the application with theme and routing context */}
    <ThemeContext>
      <FirebaseContext>
      <RouterProvider router={router}>
      </RouterProvider>
      </FirebaseContext>
    </ThemeContext>
  </StrictMode>,
)
