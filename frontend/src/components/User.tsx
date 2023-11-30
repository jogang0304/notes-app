import LogoutIcon from "@mui/icons-material/Logout";
import { Button, Divider, Paper, Stack, Typography } from "@mui/material";
import Container from "@mui/material/Container";
import Item from "@mui/material/Stack";
import { useEffect, useState } from "react";

function User({ username }: { username: string }) {
  return (
    <Paper elevation={5} sx={{ height: "100%" }}>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        spacing={0}
        height={"100%"}
        alignItems={"center"}
      >
        <Item width={"100%"}>
          <Container>
            <Typography textAlign={"center"}>{username}</Typography>
          </Container>
        </Item>
        <Item>
          <Button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.replace("/login");
            }}
          >
            <LogoutIcon />
          </Button>
        </Item>
      </Stack>
    </Paper>
  );
}

export default User;
