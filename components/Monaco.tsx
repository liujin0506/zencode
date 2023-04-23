import React from "react";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { loader } from "@monaco-editor/react";
import { Pane, Spinner } from "evergreen-ui";

export function processSize(size) {
  return !/^\d+$/.test(size) ? size : `${size}px`;
}

loader.config({
  paths: {
    vs: "https://cdn.staticfile.org/monaco-editor/0.37.1/min/vs"
  },
  "vs/nls": { availableLanguages: { "*": "zh-cn" } }
});

interface MonacoProps {
  theme?: string;
  language?: string;
  value?: string;
  width?: number | string;
  height?: number | string;
  options?: any;
  defaultValue?: string;
  onChange: (value: string) => void;
}

export const Monaco: React.FC<MonacoProps> = ({
  language,
  value,
  defaultValue,
  height,
  width,
  options,
  onChange
}) => {
  return (
    <Editor
      defaultLanguage={language}
      defaultValue={defaultValue}
      value={value}
      height={height}
      width={width}
      options={options}
      onChange={onChange}
      loading={
        <Pane
          display="flex"
          alignItems="center"
          justifyContent="center"
          height={400}
          flex={1}
        >
          <Spinner />
        </Pane>
      }
    />
  );
};

export default Monaco;
