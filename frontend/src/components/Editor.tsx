import "@mdxeditor/editor/style.css";
import {
  BoldItalicUnderlineToggles,
  ChangeCodeMirrorLanguage,
  ConditionalContents,
  InsertCodeBlock,
  InsertSandpack,
  InsertTable,
  MDXEditor,
  ShowSandpackInfo,
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
import { Box, Container, Paper, Stack } from "@mui/material";
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
    return <Paper></Paper>;
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
    const note = editor_ref.current?.getMarkdown();
    if (note === undefined) {
      return;
    }
    const firstLine = note.split("\n")[0];
    const newNote: Note = {
      id: initialNote.id,
      title: firstLine,
      text: note,
      owner_id: initialNote.owner_id,
    };
    const form = new FormData();
    form.append("note_json", JSON.stringify(newNote));
    axios
      .post("/api/notes/change", form, {
        headers: {
          token: token,
        },
      })
      .then((response) => {
        setNotes((notes) => {
          let newNotes = [...notes];
          console.log(newNotes);
          newNotes[notes.findIndex((note) => note.id === initialNote.id)] =
            newNote;
          return newNotes;
        });
      });
  }

  return (
    <Box height={"100%"}>
      <Paper sx={{ height: "100%" }}>
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
                  <Item>
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
