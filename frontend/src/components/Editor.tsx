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
} from "@mdxeditor/editor";
import { Paper } from "@mui/material";
import type { Note } from "../interfaces";
import { useEffect, useRef, useState } from "react";

function Editor({
  notes,
  currentNoteIndex,
}: {
  notes: Note[];
  currentNoteIndex: number;
}) {
  if (notes.length === 0) {
    return <Paper></Paper>;
  }
  const note = notes[currentNoteIndex];
  const [currentText, setCurrentText] = useState<string>(
    `# ${note.title}\n${note.text}`,
  );
  const editor_ref = useRef<MDXEditorMethods>(null);
  useEffect(() => {
    editor_ref.current?.setMarkdown(`# ${note.title}\n${note.text}`);
  }, [currentNoteIndex]);
  return (
    <Paper>
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
              <>
                {" "}
                <UndoRedo />
                <BoldItalicUnderlineToggles />
                <InsertTable />
                <InsertCodeBlock />
              </>
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
  );
}

export default Editor;
