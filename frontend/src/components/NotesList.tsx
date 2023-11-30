import axios from "axios";
import { useEffect, useState } from "react";
import type { Note } from "../interfaces";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Item from "@mui/material/Stack";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Delete } from "@mui/icons-material";

function TaskList({
  notes,
  setNotes,
  setCurrentNoteIndex,
  currentNoteIndex,
}: {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  setCurrentNoteIndex: React.Dispatch<React.SetStateAction<number>>;
  currentNoteIndex: number;
}) {
  const [loadedNotes, setLoadedNotes] = useState<boolean>(false);
  useEffect(() => {
    localStorage.setItem("currentNoteIndex", currentNoteIndex.toString());
    let token = localStorage.getItem("token");
    const fetchNotes = async () => {
      let response = await axios.post(
        "/api/notes/user",
        {},
        {
          headers: {
            token: token,
          },
        },
      );

      let ids: number[] = response.data;
      let receivingNotes: Note[] = [];

      for await (const note_id of ids) {
        console.log("adding " + note_id.toString());
        const form = new FormData();
        form.append("id", note_id.toString());
        let result = await axios.post("/api/notes/get", form, {
          headers: {
            token: token,
          },
        });
        receivingNotes.push(result.data);
      }

      setNotes(receivingNotes);
      setLoadedNotes(true);
    };
    fetchNotes().catch((error) => {
      console.log(error);
    });
  }, []);

  if (!loadedNotes) {
    return (
      <Paper elevation={5} sx={{ height: "100%" }}>
        <Box
          sx={{
            display: "flex",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      </Paper>
    );
  }
  return (
    <Paper
      elevation={5}
      sx={{
        height: "100%",
        width: "100%",
        overflow: "hidden",
        //maxHeight: "91vh",
        boxSizing: "border-box",
        padding: 0,
      }}
    >
      <List
        sx={{ maxHeight: "100%", overflow: "auto", boxSizing: "border-box" }}
        disablePadding
      >
        {notes.map((note, index) => (
          <div key={note.id}>
            <Box
              bgcolor={
                currentNoteIndex === index ? "rgba(0, 162, 255, 0.13)" : "white"
              }
            >
              <ListItem
                disablePadding
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => {
                      let token = localStorage.getItem("token");
                      const form = new FormData();
                      form.append("id", note.id.toString());
                      axios
                        .post("/api/notes/delete", form, {
                          headers: {
                            token: token,
                          },
                        })
                        .then((response) => {
                          setNotes((notes) => {
                            let newNotes = [...notes];
                            newNotes.splice(index, 1);
                            setNotes(newNotes);
                            return newNotes;
                          });
                          if (currentNoteIndex === index) {
                            setCurrentNoteIndex(0);
                            localStorage.setItem("currentNoteIndex", "0");
                          }
                        });
                    }}
                  >
                    <Icon>
                      <Delete />
                    </Icon>
                  </IconButton>
                }
              >
                <ListItemButton
                  onClick={() => {
                    setCurrentNoteIndex(index);
                    localStorage.setItem("currentNoteIndex", index.toString());
                    console.log(currentNoteIndex);
                  }}
                >
                  <ListItemText
                    primary={note.title}
                    sx={{ overflow: "hidden" }}
                  />
                </ListItemButton>
              </ListItem>
            </Box>
            <Divider />
          </div>
        ))}
        <ListItem>
          <ListItemButton
            onClick={() => {
              let token = localStorage.getItem("token");
              const form = new FormData();
              form.append("title", "# New note");
              form.append("text", "# New note");
              axios
                .post("/api/notes/create", form, {
                  headers: {
                    token: token,
                  },
                })
                .then((response) => {
                  setNotes((notes) => {
                    let newNotes = [...notes];
                    newNotes.push(response.data);
                    setNotes(newNotes);
                    return newNotes;
                  });
                });
            }}
          >
            <ListItemIcon>
              <Icon>
                <AddCircleOutlineIcon />
              </Icon>
            </ListItemIcon>
            <ListItemText primary={"New note"} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
    </Paper>
  );
}

export default TaskList;
