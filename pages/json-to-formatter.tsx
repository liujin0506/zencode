import ConversionPanel from "@components/ConversionPanel";
import { EditorPanelProps, TransformResult } from "@components/EditorPanel";
import Form, { InputType } from "@components/Form";
import { useSettings } from "@hooks/useSettings";
import { useCallback } from "react";
import * as React from "react";
import { Alert, Heading } from "evergreen-ui";
import fmt2json, { Options } from "fmt-to-json";

interface Settings {
  compress: boolean;
  unEscape: boolean;
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
  },
  {
    type: InputType.SWITCH,
    key: "escape",
    label: "结果转义"
  },
  {
    type: InputType.SWITCH,
    key: "unUnicode",
    label: "Unicode解码"
  },
  {
    type: InputType.SWITCH,
    key: "unicode",
    label: "Unicode编码"
  }
];

export default function JsonToFormatter() {
  const name = "json2formatter";

  const [settings, setSettings] = useSettings(name, {
    compress: false,
    unEscape: true,
    escape: false,
    unicode: false,
    unUnicode: true
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
    async ({ value }) => {
      let options: Options = {
        expand: true,
        unUnicode: true
      };
      if (settings.compress) {
        options.expand = false;
      }
      if (settings.unEscape) {
        options.unscape = true;
      }
      if (settings.escape) {
        options.escape = true;
      }
      if (settings.unUnicode === false) {
        options.unUnicode = false;
      }
      if (settings.unicode) {
        options.unicode = true;
      }
      if (value === "") {
        return {
          result: "",
          prettier: false,
          err: ""
        };
      }
      let ret = await fmt2json(value, options);
      let err = "";
      if (ret.status.errFormat) {
        err = ret.status.message + ", errNear:" + ret.status.errNear;
      }
      let result: TransformResult = {
        result: ret.result,
        prettier: false,
        err: err
      };
      return result;
    },
    [settings]
  );

  return (
    <ConversionPanel
      transformer={transformer}
      editorTitle="JSON"
      editorLanguage="json"
      editorDefaultValue="jsonRaw"
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
      resultEditorProps={{
        hasTrans: true
      }}
    />
  );
}
