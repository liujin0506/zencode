import ConversionPanel from "@components/ConversionPanel";
import { EditorPanelProps } from "@components/EditorPanel";
import Form, { InputType } from "@components/Form";
import { useSettings } from "@hooks/useSettings";
import { useCallback } from "react";
import * as React from "react";
import { Alert, Badge, Heading, Pane } from "evergreen-ui";

interface Settings {
  compress: boolean;
  unEscape: boolean;
  notPrettier: boolean;
}

const formFields = [
  {
    type: InputType.SWITCH,
    key: "compress",
    label: "压缩"
  },
  {
    type: InputType.SWITCH,
    key: "unEscape",
    label: "去除转义"
  }
];

export default function JsonToFormatter() {
  const name = "json-formatter";

  const [settings, setSettings] = useSettings(name, {
    compress: false,
    unEscape: false,
    notPrettier: false
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
    ({ value }) => {
      return prettifyJson(value, settings);
    },
    [settings]
  );

  function yasuo(t, e) {
    if (1 === t || 3 === t) {
      for (
        var n = [], i = !1, o = 0, r = (e = e.split("\n").join(" ")).length;
        o < r;
        o++
      ) {
        var a = e.charAt(o);
        i && a === i
          ? "\\" !== e.charAt(o - 1) && (i = !1)
          : i || ('"' !== a && "'" !== a)
          ? i || (" " !== a && "\t" !== a) || (a = "")
          : (i = a),
          n.push(a);
      }
      e = n.join("");
    }
    (2 !== t && 3 !== t) ||
      (e = e.replace(/\\/g, "\\\\").replace(/\"/g, '\\"')),
      4 === t && (e = e.replace(/\\\\/g, "\\").replace(/\\\"/g, '"'));
    return e;
  }

  async function prettifyJson(value: string, settings: Settings) {
    if (settings.unEscape) {
      value = yasuo(4, value);
    }
    let str = JSON.stringify(JSON.parse(value), null, 1);
    if (settings.compress) {
      str = yasuo(1, str);
      settings.notPrettier = true;
    } else {
      settings.notPrettier = false;
    }
    setSettings(settings);
    return str;
  }

  return (
    <ConversionPanel
      transformer={transformer}
      editorTitle="JSON"
      editorLanguage="json"
      editorDefaultValue={"jsonRaw"}
      resultTitle="格式化JSON"
      resultLanguage={"json"}
      editorSettingsElement={getSettingsElement}
      settings={settings}
      editorProps={{
        topNotifications: ({ toggleSettings }) => (
          <Alert
            intent="success"
            backgroundColor="#FEF8E7"
            title={
              <>
                JSON 格式化支持压缩和去除转义, 您可以在{""}
                <Heading
                  size={400}
                  is="a"
                  color={"blue"}
                  onClick={toggleSettings}
                >
                  转换配置
                </Heading>
                进行切换
              </>
            }
          />
        )
      }}
    />
  );
}
