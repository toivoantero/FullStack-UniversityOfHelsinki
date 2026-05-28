import { Alert } from '@mui/material'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <Alert severity={message.type === 'success' ? 'success' : 'error'}>
      {message.content}
    </Alert>
  )
}

export default Notification