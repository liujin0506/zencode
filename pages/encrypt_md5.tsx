import ConversionPanel from "@components/ConversionPanel";
import { EditorPanelProps } from "@components/EditorPanel";
import Form, { InputType } from "@components/Form";
import { useSettings } from "@hooks/useSettings";
import { useCallback } from "react";
import * as React from "react";
import { upperCase } from "lodash";
const crypto = require("crypto");

interface Settings {
  is_up: boolean;
}

const formFields = [
  {
    type: InputType.SWITCH,
    key: "is_up",
    label: "是否大写"
  }
];

export default function Md5() {
  const name = "encrypt_md5";
  const [settings, setSettings] = useSettings(name, {
    is_up: false
  });

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
    ({ value }) => Promise.resolve(Md5(value, settings)),
    [settings]
  );

  function Md5(value, settings) {
    if (!value) {
      return " ";
    }
    let str = crypto
      .createHash("md5")
      .update(value)
      .digest("hex");
    if (settings.is_up) {
      str = str.toUpperCase();
    }
    return str;
  }

  return (
    <ConversionPanel
      transformer={transformer}
      editorTitle="Text"
      editorLanguage="text"
      editorDefaultValue={"text"}
      resultTitle="Md5"
      resultLanguage={"text"}
      editorSettingsElement={getSettingsElement}
      settings={settings}
    />
  );
}
