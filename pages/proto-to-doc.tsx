import ConversionPanel from "@components/ConversionPanel";
import { EditorPanelProps } from "@components/EditorPanel";
import Form, { InputType } from "@components/Form";
import { useSettings } from "@hooks/useSettings";
import { useCallback } from "react";
import * as React from "react";
import { markdown } from "markdown";
import { Alert, Badge, Heading, Pane } from "evergreen-ui";

interface Settings {
  html: string;
}

const formFields = [];

export default function ProtoToDoc() {
  const name = "proto-doc";

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
    let markdownArr = [];
    if (fileLine.length > 0) {
      fileLine.forEach(element => {
        if (element.indexOf("message") != -1) {
          let structName = element.replace(/(message)|({)/g, "").trim();
          markdownArr.push("### " + structName + " 参数说明");
          markdownArr.push("");
          markdownArr.push("| 名称 | 类型 | 是否必填 | 备注 | 其他信息 |");
          markdownArr.push("| :--- | :---: | :---: | :--- | --- |");
        }
        let required = "否";
        let extra = "";
        if (element.indexOf("validate") != -1) {
          let reg = /\[\(validate.*\}\];/;
          let regArr = reg.exec(element);
          if (regArr.length > 0) {
            extra = regArr[0];
            element = element.replace(extra, "");
            if (extra.indexOf("min") != -1 || extra.indexOf("gt") != -1) {
              required = "是";
            }
          }
        }
        if (element.indexOf("}") != -1) {
          markdownArr.push("");
          markdownArr.push("");
        }
        if (element.indexOf("message") != -1 || element.indexOf("}") != -1) {
          return;
        }
        element = element.replace(/(^\s*)|(\s*$)/g, "");
        let parts = element.trim().split(/\s+/);
        if (parts.length < 4) {
          return;
        }
        if (parts[0] == "required") {
          parts.shift();
          required = "是";
        }
        if (parts[0] == "repeated") {
          parts.shift();
          parts[0] = "[]" + parts[0];
        }
        let comment = "";
        for (let i = 4; i < parts.length; i++) {
          if (parts[i] != "//") {
            comment = comment + parts[i];
          }
        }
        arr.push({
          column: parts[1],
          type: parts[0],
          comment: comment
        });
        markdownArr.push(
          "| " +
            parts[1] +
            " | " +
            parts[0] +
            " | " +
            required +
            " | " +
            comment +
            " | " +
            extra +
            " |"
        );
      });
    }
    let mardownStr = "";
    if (markdownArr.length > 0) {
      mardownStr = markdownArr.join("\n");
    }
    return mardownStr;
  }

  return (
    <ConversionPanel
      transformer={transformer}
      editorTitle="Proto"
      editorLanguage="proto"
      editorDefaultValue={"proto"}
      resultTitle="MarkDown"
      resultLanguage={"text"}
      editorSettingsElement={getSettingsElement}
      settings={settings}
      resultEditorProps={{
        previewElement: value => {
          return markdown.toHTML(value, "Maruku") + "<br />";
        }
      }}
    />
  );
}
