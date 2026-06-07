// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import { AuthProvider } from './context/AuthContext'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <AuthProvider>
//       <App />
//     </AuthProvider>
//   </StrictMode>
// )
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthContext'
import { JournalProvider } from './context/JournalContext'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <JournalProvider>
        <App />
      </JournalProvider>
    </AuthProvider>
  </StrictMode>
)