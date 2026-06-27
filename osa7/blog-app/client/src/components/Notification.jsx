import { Alert } from "@mui/material";
import { useNotifications } from "../store";

const Notification = () => {
  const { message, isError } = useNotifications().notification;

  if (!message) {
    return null;
  }

  return (
    <Alert severity={isError ? "error" : "success"} sx={{ my: 2 }}>
      {message}
    </Alert>
  );
};

export default Notification;
