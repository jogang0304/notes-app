import { Button, Stack, TextField, Typography, Input } from "@mui/material";
import Paper from "@mui/material/Paper";
import { useState } from "react";
import axios from "axios";

function LoginForm() {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  function sendForm() {
    if (username === "") {
      setErrorMessage("Username is required");
      return;
    }
    if (password === "") {
      setErrorMessage("Password is required");
      return;
    }
    const form = new FormData();
    form.append("username", username);
    form.append("password", password);
    axios
      .post("/api/users/login", form)
      .then((response) => {
        console.log(response.data);
        localStorage.setItem("token", response.data);
        window.location.replace("/");
      })
      .catch((error) => {
        setErrorMessage("Invalid username or password");
      });
  }

  return (
    <Paper>
      <Stack padding={2} spacing={2}>
        <TextField
          label="Username"
          variant="outlined"
          onChange={(event) => {
            setUsername(event?.target.value);
          }}
          value={username}
        ></TextField>
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          onChange={(event) => {
            setPassword(event?.target.value);
          }}
          value={password}
        ></TextField>
        <Button variant="contained" onClick={sendForm}>
          Login
        </Button>
        <Typography textAlign={"center"} color="error">
          {errorMessage}
        </Typography>
        <Button
          variant="text"
          onClick={() => {
            window.location.replace("/register");
          }}
        >
          Register
        </Button>
      </Stack>
    </Paper>
  );
}

export default LoginForm;
