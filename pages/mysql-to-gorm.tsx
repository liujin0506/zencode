import { Alert, Heading } from "evergreen-ui";
import ConversionPanel from "@components/ConversionPanel";
import { EditorPanelProps } from "@components/EditorPanel";
import Form, { InputType } from "@components/Form";
import { useSettings } from "@hooks/useSettings";
import { useCallback } from "react";
import * as React from "react";
import request from "@utils/request";

interface Settings {
  col_prefix: string;
  table_prefix: string;
  json_tag: boolean;
}

const formFields = [
  {
    type: InputType.TEXT_INPUT,
    key: "col_prefix",
    label: "字段前缀"
  },
  {
    type: InputType.TEXT_INPUT,
    key: "table_prefix",
    label: "表前缀"
  },
  {
    type: InputType.SWITCH,
    key: "json_tag",
    label: "是否包含 Json 标签"
  },
  {
    type: InputType.TEXT_INPUT,
    key: "package",
    label: "Gorm包名"
  },
  {
    type: InputType.SWITCH,
    key: "no_null",
    label: "是否使用 Null 类型"
  },
  {
    type: InputType.SELECT,
    key: "null_style",
    label: "Null 类型",
    options: [
      { label: "sql.NullXxx", value: "sql" },
      { label: "*xxxx", value: "ptr" }
    ]
  },
  {
    type: InputType.SWITCH,
    key: "gorm_type",
    label: "是否包含字段类型"
  },
  {
    type: InputType.SWITCH,
    key: "include_default",
    label: "是否包含 default"
  },
  {
    type: InputType.SWITCH,
    key: "include_not_null",
    label: "是否包含 NOT NULL"
  },
  {
    type: InputType.SWITCH,
    key: "primary_key",
    label: "是否包含 Primary Key"
  },
  {
    type: InputType.SWITCH,
    key: "auto_incr",
    label: "是否包含 AUTO_INCREMENT"
  }
];

export default function JsonToFormatter() {
  const name = "MysqlToGorm";

  const [settings, setSettings] = useSettings(name, {
    col_prefix: "",
    table_prefix: "",
    json_tag: true,
    package: "",
    no_null: false,
    null_style: "sql",
    gorm_type: false,
    include_not_null: true,
    include_default: true,
    primary_key: true,
    auto_incr: true
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
    ({ value }) =>
      request("/api/mysql-to-gorm", {
        value,
        settings
      }),
    [settings]
  );

  return (
    <ConversionPanel
      transformer={transformer}
      editorTitle="MySQL Schema"
      editorLanguage="sql"
      editorDefaultValue={"mysqlSchema"}
      resultTitle="Gorm"
      resultLanguage={"go"}
      editorSettingsElement={getSettingsElement}
      settings={settings}
      editorProps={{
        topNotifications: ({ toggleSettings }) => (
          <Alert
            intent="success"
            backgroundColor="#FEF8E7"
            title={
              <>
                支持更多选项, 您可以在{""}
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
