import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormControl, Input, Button, InputLabel } from "@mui/material";
import { useUserActions } from "../store";
import { useNotificationActions } from "../store";
import { useField } from "../hooks";

const Login = () => {
  const navigation = useNavigate();
  const { login } = useUserActions()
  const { setNotification } = useNotificationActions()
  const username = useField({});
  const password = useField({ type: "password" });

  const doLogin = async (e) => {
    e.preventDefault()
    try {
      login({ username: username.value, password: password.value });
      navigation("/");
    } catch (e) {
      setNotification({ message: "wrong username or password" });
      setTimeout(() => {
        setNotification({ message: null });
      }, 25000);
      console.log(e);
      console.log("wrong credentials");
    }
  };

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={doLogin}>
        <div style={{ marginBottom: 8 }}>
          <FormControl>
            <InputLabel>username</InputLabel>
            <Input
              {...username}
            />
          </FormControl>
        </div>
        <div style={{ marginBottom: 8 }}>
          <FormControl>
            <InputLabel>password</InputLabel>
            <Input
              {...password}
            />
          </FormControl>
        </div>
        <div style={{ marginTop: 8 }}>
          <Button type="submit" variant="contained">
            login
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Login;
