import ConversionPanel from "@components/ConversionPanel";
import { EditorPanelProps } from "@components/EditorPanel";
import Form, { InputType } from "@components/Form";
import { useSettings } from "@hooks/useSettings";
import { useCallback } from "react";
import * as React from "react";
import { markdown } from "markdown";

interface Settings {
  html: string;
}

const formFields = [];

export default function ProtoToReOrder() {
  const name = "proto-reorder";

  const [settings, setSettings] = useSettings(name, {});

  const getSettingsElement = useCallback<EditorPanelProps["settingElement"]>(
    ({ open, toggle }) => {
      return (
        <Form<Settings>
          title={name}
          onSubmit={setSettings}
          open={open}
          toggle={toggle}
          formsFields={formFields}
          initialValues={settings}
        />
      );
    },
    []
  );

  const transformer = useCallback(
    ({ value }) => {
      return toDoc(value);
    },
    [settings]
  );

  async function toDoc(value: string) {
    let fileLine = value.split("\n");
    let arr = [];
    let i = 1;
    if (fileLine.length > 0) {
      fileLine.forEach(element => {
        if (element.indexOf("=") != -1) {
          element = element.replace(/\=\s-?[1-9]\d*/, "= " + i);
          element = element.replace(/\=-?[1-9]\d*/, "= " + i);
          i++;
        }
        arr.push(element);
      });
    }
    let str = "";
    if (arr.length > 0) {
      str = arr.join("\n");
    }
    return str;
  }

  return (
    <ConversionPanel
      transformer={transformer}
      editorTitle="Proto"
      editorLanguage="proto"
      editorDefaultValue={"protoReorder"}
      resultTitle="ReOrder"
      resultLanguage={"proto"}
      editorSettingsElement={getSettingsElement}
      settings={settings}
    />
  );
}
