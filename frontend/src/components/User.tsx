import LogoutIcon from "@mui/icons-material/Logout";
import { Button, Divider, Paper, Stack } from "@mui/material";
import Item from "@mui/material/Stack";
import { useEffect, useState } from "react";

function User({ username }: { username: string }) {
  return (
    <Paper>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        spacing={2}
        height="5vh"
        padding={2}
      >
        <Item>{username}</Item>
        <Item width={"fit-content"}>
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
