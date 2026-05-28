import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Notification from './Notification'
import { TextField, Button } from '@mui/material'

const LoginForm = ({ logUserIn, notificationMessage }) => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async event => {
    event.preventDefault()
    logUserIn({ username, password })
    setUsername('')
    setPassword('')
    navigate('/')
  }

  return (
    <div>
      <h2>Log in to application</h2>
      <Notification message={notificationMessage} />
      <form onSubmit={handleLogin}>
        <div>
          <TextField
            label="username"
            type="text"
            name="username"
            value={username}
            onChange={event => setUsername(event.target.value)}
            variant="standard"
          />
        </div>
        <div>
          <TextField
            label="password"
            type="password"
            name="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            variant="standard"
          />
        </div>
        <Button type="submit" variant="contained" style={{ margin: 10 }}>
          login
        </Button>
      </form>
    </div>
  )
}

export default LoginForm