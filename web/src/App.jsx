import { Routes, Route, Navigate } from 'react-router-dom'
import { Box } from '@mui/material'

// Pages (to be created)
// import Login from './pages/Login'
// import Dashboard from './pages/Dashboard'
// import Profile from './pages/Profile'
// import NFCManagement from './pages/NFCManagement'
// import AdminPanel from './pages/AdminPanel'

function App() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/register" element={<div>Register Page</div>} />
        <Route path="/dashboard" element={<div>Dashboard</div>} />
        <Route path="/profile" element={<div>Profile</div>} />
        <Route path="/nfc" element={<div>NFC Management</div>} />
        <Route path="/admin" element={<div>Admin Panel</div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Box>
  )
}

// Temporary Home Page
function HomePage() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        px: 2,
      }}
    >
      <h1>NFC Medical Platform</h1>
      <p>Экстренный доступ к медицинским данным через NFC</p>
      <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
        <a href="/login" style={{ textDecoration: 'none' }}>
          <button
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              cursor: 'pointer',
              borderRadius: '8px',
              border: 'none',
              background: '#1976d2',
              color: 'white',
            }}
          >
            Войти
          </button>
        </a>
        <a href="/register" style={{ textDecoration: 'none' }}>
          <button
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              cursor: 'pointer',
              borderRadius: '8px',
              border: '1px solid #1976d2',
              background: 'white',
              color: '#1976d2',
            }}
          >
            Регистрация
          </button>
        </a>
      </Box>
    </Box>
  )
}

export default App
