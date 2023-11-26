import { Container, Grid, Stack } from "@mui/material";
import Paper from "@mui/material/Paper";
import Item from "@mui/material/Stack";
import RegisterForm from "./RegisterForm";

function Login() {
  return (
    <Stack
      spacing={1}
      justifyContent="center"
      alignItems={"center"}
      height="100vh"
      width={"100vw"}
    >
      <Item width={"30vw"}>
        <RegisterForm />
      </Item>
    </Stack>
  );
}

export default Login;
