import ConversionPanel from "@components/ConversionPanel";
import { useCallback } from "react";
import * as React from "react";
import { Buffer } from "buffer";

export default function Base64Decode() {
  const transformer = useCallback(
    ({ value }) => Promise.resolve(Base64Decode(value)),
    []
  );

  function Base64Decode(value) {
    if (!value) {
      return " ";
    }
    return Buffer.from(value, "base64").toString();
  }

  return (
    <ConversionPanel
      transformer={transformer}
      editorTitle="Base64Encode"
      editorLanguage="text"
      editorDefaultValue={"base64Encode"}
      resultTitle="Text"
      resultLanguage={"text"}
    />
  );
}
