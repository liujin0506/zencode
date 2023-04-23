import ConversionPanel from "@components/ConversionPanel";
import { useCallback } from "react";
import * as React from "react";
import { Buffer } from "buffer";

export default function Base64Encode() {
  const transformer = useCallback(
    ({ value }) => Promise.resolve(Base64Encode(value)),
    []
  );

  function Base64Encode(value) {
    if (!value) {
      return " ";
    }
    return Buffer.from(value).toString("base64");
  }

  return (
    <ConversionPanel
      transformer={transformer}
      editorTitle="Text"
      editorLanguage="text"
      editorDefaultValue={"text"}
      resultTitle="Base64Encode"
      resultLanguage={"text"}
    />
  );
}
