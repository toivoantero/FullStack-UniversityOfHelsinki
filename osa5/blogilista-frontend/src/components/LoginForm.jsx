import { useState } from 'react'

const LoginForm = ({ logUserIn }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async event => {
    event.preventDefault()
    logUserIn({ username, password })
    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <input
              type="text"
              name="username"
              value={username}
              onChange={event => setUsername(event.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type="password"
              name="password"
              value={password}
              onChange={event => setPassword(event.target.value)}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm