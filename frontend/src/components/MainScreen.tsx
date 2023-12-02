import { Box, Grid, Stack } from "@mui/material";
import Item from "@mui/material/Stack";
import User from "./User";
import TaskList from "./NotesList";
import Editor from "./Editor";
import { useEffect, useState } from "react";
import axios from "axios";
import type { Note, Token } from "../interfaces";

function MainScreen() {
  const [username, setUsername] = useState<string>("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNoteIndex, setCurrentNoteIndex] = useState<number>(0);

  useEffect(() => {
    console.log("notes changes");
  }, [notes]);

  function parseJwt(token: string): Token {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );

    return JSON.parse(jsonPayload);
  }
  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token === null) {
      window.location.replace("/login");
      return;
    }
    setUsername(parseJwt(token).username);
    let current_time = Math.round(Date.now() / 1000);
    console.log(current_time);
    if (current_time > parseJwt(token).expires - 1000) {
      axios
        .post("/api/users/renew", {}, { headers: { token: token } })
        .then((response) => {
          localStorage.setItem("token", response.data);
        })
        .catch((error) => {
          window.location.replace("/login");
        });
    }
    axios.defaults.headers.post["token"] = `${token}`;
  }, []);

  return (
    <Grid container sx={{ height: "100vh" }} spacing={1} padding={1}>
      <Grid item xs={3} maxHeight={"100vh"} sx={{ display: "block" }}>
        <Box sx={{ height: "100%", display: "block", boxSizing: "border-box" }}>
          <Stack spacing={1} height={"100%"} boxSizing={"border-box"}>
            <Item height={"5vh"} boxSizing={"border-box"}>
              <User username={username} />
            </Item>
            <Item
              sx={{ flexGrow: 1 }}
              maxHeight={"92vh"}
              boxSizing={"border-box"}
            >
              <TaskList
                notes={notes}
                setNotes={setNotes}
                setCurrentNoteIndex={setCurrentNoteIndex}
                currentNoteIndex={currentNoteIndex}
              />
            </Item>
          </Stack>
        </Box>
      </Grid>
      <Grid item xs={9}>
        <Editor
          notes={notes}
          currentNoteIndex={currentNoteIndex}
          setNotes={setNotes}
        />
      </Grid>
    </Grid>
  );
}

export default MainScreen;
