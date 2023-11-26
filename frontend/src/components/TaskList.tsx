import axios from "axios";
import { useEffect } from "react";
import type { Note } from "../interfaces";
import { Button, Stack } from "@mui/material";
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
    <Paper>
      <Stack>
        {notes.map((note, index) => (
          <Item key={index} margin={1}>
            <Button
              variant="outlined"
              onClick={() => {
                setCurrentNoteIndex(index);
              }}
            >
              {note.title}
            </Button>
          </Item>
        ))}
      </Stack>
    </Paper>
  );
}

export default TaskList;
