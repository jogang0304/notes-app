import { Stack } from "@mui/material";
import Item from "@mui/material/Stack";
import LoginForm from "./LoginForm";

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
        <LoginForm />
      </Item>
    </Stack>
  );
}

export default Login;
