import axios from "axios";
import { useEffect } from "react";
import type { Note } from "../interfaces";
import {
  Box,
  Button,
  Divider,
  Icon,
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
    };
    fetchNotes().catch((error) => {
      console.log(error);
    });
  }, []);

  return (
    <Paper sx={{ height: "100%" }}>
      <List>
        {notes.map((note, index) => (
          <Box
            bgcolor={
              currentNoteIndex === index ? "rgba(0, 162, 255, 0.13)" : "white"
            }
          >
            <ListItem key={note.id} disablePadding>
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
            <Divider />
          </Box>
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
