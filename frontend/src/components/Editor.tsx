import "@mdxeditor/editor/style.css";
import {
  BoldItalicUnderlineToggles,
  InsertCodeBlock,
  InsertTable,
  MDXEditor,
  UndoRedo,
  codeBlockPlugin,
  codeMirrorPlugin,
  headingsPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  tablePlugin,
  toolbarPlugin,
  type MDXEditorMethods,
  Button,
} from "@mdxeditor/editor";
import { Box, Paper, Stack } from "@mui/material";
import Item from "@mui/material/Stack";
import type { Note } from "../interfaces";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

function Editor({
  notes,
  currentNoteIndex,
  setNotes,
}: {
  notes: Note[];
  currentNoteIndex: number;
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}) {
  if (notes.length === 0) {
    return (
      <Box height={"100%"}>
        <Paper elevation={5} sx={{ height: "100%" }}></Paper>
      </Box>
    );
  }
  const note = notes[currentNoteIndex];
  const [currentText, setCurrentText] = useState<string>(`${note.text}`);
  const editor_ref = useRef<MDXEditorMethods>(null);
  useEffect(() => {
    editor_ref.current?.setMarkdown(`${note.text}`);
  }, [localStorage.getItem("currentNoteIndex")]);

  function changeNote() {
    console.log(localStorage.getItem("currentNoteIndex") ?? "0");
    console.log(notes);
    const initialNote =
      notes[parseInt(localStorage.getItem("currentNoteIndex") ?? "0")];
    console.log(initialNote);
    let token = localStorage.getItem("token");
    const note_text = editor_ref.current?.getMarkdown();
    if (note_text === undefined) {
      return;
    }
    const firstLine = note_text.split("\n")[0];
    const newNote: Note = {
      id: initialNote.id,
      title: firstLine,
      text: note_text,
      owner_id: initialNote.owner_id,
    };
    console.log(newNote);
    const form = new FormData();
    form.append("note_json", JSON.stringify(newNote));
    axios
      .post("/api/notes/change", form, {
        headers: {
          token: token,
        },
      })
      .then((response) => {
        let newNotes = notes;
        newNotes[notes.findIndex((note) => note.id === initialNote.id)] =
          response.data;
        setNotes(newNotes);
      });
  }

  function downloadNote() {
    const cur_index = localStorage.getItem("currentNoteIndex");
    if (cur_index === null) {
      return;
    }
    const current_note = notes[parseInt(cur_index)];
    let token = localStorage.getItem("token");
    const form = new FormData();
    form.append("id", current_note.id.toString());
    console.log(current_note.id);
    axios
      .post("/api/notes/download", form, {
        headers: {
          token: token,
        },
        responseType: "blob",
      })
      .then((response) => {
        const href = window.URL.createObjectURL(response.data);

        const anchorElement = document.createElement("a");

        anchorElement.href = href;
        anchorElement.download =
          response.headers["content-disposition"].split("filename=")[1];

        document.body.appendChild(anchorElement);
        anchorElement.click();

        document.body.removeChild(anchorElement);
        window.URL.revokeObjectURL(href);
        console.log(response);
      });
  }

  return (
    <Box height={"100%"}>
      <Paper sx={{ height: "100%" }} elevation={5}>
        <MDXEditor
          ref={editor_ref}
          markdown="# Hello World"
          onChange={(markdown) => {
            setCurrentText(markdown);
            console.log(currentText);
          }}
          plugins={[
            toolbarPlugin({
              toolbarContents: () => (
                <Stack
                  direction={"row"}
                  width={"100%"}
                  justifyContent={"space-between"}
                >
                  <Item direction={"row"}>
                    <UndoRedo />
                    <BoldItalicUnderlineToggles />
                    <InsertTable />
                    <InsertCodeBlock />
                  </Item>
                  <Item direction={"row"} spacing={2}>
                    <Button onClick={downloadNote}>Download</Button>
                    <Button onClick={changeNote}>Save</Button>
                  </Item>
                </Stack>
              ),
            }),
            headingsPlugin(),
            linkPlugin(),
            listsPlugin(),
            quotePlugin(),
            markdownShortcutPlugin(),
            codeBlockPlugin({ defaultCodeBlockLanguage: "js" }),
            codeMirrorPlugin({
              codeBlockLanguages: { js: "JavaScript", css: "CSS" },
            }),
            tablePlugin(),
          ]}
        />
      </Paper>
    </Box>
  );
}

export default Editor;
