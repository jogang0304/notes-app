import { Button, Stack, TextField, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import { useState } from "react";
import axios from "axios";

function RegisterForm() {
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
      .post("/api/users/register", form)
      .then((response) => {
        console.log(response.data);
        localStorage.setItem("token", response.data);
        window.location.replace("/");
      })
      .catch((error) => {
        setErrorMessage("Username already exists");
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
          type="password"
          variant="outlined"
          onChange={(event) => {
            setPassword(event?.target.value);
          }}
          value={password}
        ></TextField>
        <Button variant="contained" onClick={sendForm}>
          Register
        </Button>
        <Typography textAlign={"center"} color="error">
          {errorMessage}
        </Typography>
        <Button
          variant="text"
          onClick={() => {
            window.location.replace("/login");
          }}
        >
          Login
        </Button>
      </Stack>
    </Paper>
  );
}

export default RegisterForm;
