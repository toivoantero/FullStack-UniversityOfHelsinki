import { useNotifications } from '../store'

const Notification = () => {
  const message = useNotifications().notification

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10
  }

  return (
    <div style={style}>
      {message}
    </div>
  )
}

export default Notification