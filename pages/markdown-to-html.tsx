import ConversionPanel from "@components/ConversionPanel";
import { useCallback } from "react";
import * as React from "react";
import { markdown } from "markdown";

export default function MarkdownToHtml() {
  const transformer = useCallback(({ value }) => {
    return markdown.toHTML(value, "Maruku");
  }, []);

  return (
    <ConversionPanel
      transformer={transformer}
      editorTitle="Markdown"
      editorLanguage="markdown"
      resultTitle="HTML"
      resultLanguage={"html"}
      resultEditorProps={{
        previewElement: value => {
          return value;
        }
      }}
    />
  );
}
