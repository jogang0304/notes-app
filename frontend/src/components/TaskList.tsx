import axios from "axios";
import { useEffect } from "react";
import type { Note } from "../interfaces";
import {
  Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Item from "@mui/material/Stack";

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
  useEffect(() => {
    let token = localStorage.getItem("token");
    axios
      .post(
        "/api/notes/user",
        {},
        {
          headers: {
            token: token,
          },
        },
      )
      .then((response) => {
        let ids: number[] = response.data;
        ids.forEach((note_id) => {
          const form = new FormData();
          form.append("id", note_id.toString());
          axios
            .post("/api/notes/get", form, {
              headers: {
                token: token,
              },
            })
            .then((response) => {
              setNotes((notes) => [...notes, response.data]);
            });
        });
      });
  }, []);

  return (
    <Paper sx={{ height: "100%" }}>
      <List>
        {notes.map((note, index) => (
          <>
            <ListItem key={note.id} disablePadding>
              <ListItemButton
                onClick={() => {
                  setCurrentNoteIndex(index);
                  console.log(currentNoteIndex);
                }}
              >
                <ListItemText primary={note.title} />
              </ListItemButton>
            </ListItem>
            <Divider />
          </>
        ))}
      </List>
    </Paper>
  );
}

export default TaskList;
