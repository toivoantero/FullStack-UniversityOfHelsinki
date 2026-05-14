const LoginForm = ({ handleLogin, username, password, handleInputChange }) => {

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
              onChange={handleInputChange}
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
              onChange={handleInputChange}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm