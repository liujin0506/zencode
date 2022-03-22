import ConversionPanel, { Transformer } from "@components/ConversionPanel";
import * as React from "react";
import { EditorPanelProps } from "@components/EditorPanel";
import Form, { InputType } from "@components/Form";
import { useSettings } from "@hooks/useSettings";
import { useCallback } from "react";
import { convert, Options } from "@utils/json2protobuf";

interface Settings {
  inline: boolean;
}

const formFields = [
  {
    type: InputType.SWITCH,
    key: "inline",
    label: "内联定义"
  }
];

export default function JsonToProtobuf() {
  const name = "JSON 转换为 ProtoBuf";

  const [settings, setSettings] = useSettings(name, {
    inline: false
  });

  const transformer = useCallback(
    ({ value }) => {
      const options = new Options(settings.inline);
      let a = convert(value, options).success;
      return Promise.resolve(a);
    },
    [settings]
  );

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

  return (
    <ConversionPanel
      transformer={transformer}
      editorTitle="JSON"
      editorLanguage="json"
      editorDefaultValue="json"
      resultTitle="Protobuf"
      resultLanguage={"text"}
      editorSettingsElement={getSettingsElement}
      settings={settings}
    />
  );
}
