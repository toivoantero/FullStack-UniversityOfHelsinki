const Notification = ({ message }) => {
    if (message === null) {
        return null
    }

    const notificationColor = message.type === 'success' ? 'green' : 'red'

    const notificationStyle = {
        color: notificationColor,
        background: 'lightgrey',
        fontSize: '20px',
        borderStyle: 'solid',
        borderRadius: '5px',
        padding: '10px',
        marginBottom: '10px',
    }

    return (
        <div className="error" style={notificationStyle}>
            {message.content}
        </div>
    )
}

export default Notification