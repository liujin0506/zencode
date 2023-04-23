import { Settings } from "@constants/svgoConfig";
import { default as React, useCallback } from "react";
import { EditorPanelProps } from "@components/EditorPanel";
import Form from "@components/Form";
import ConversionPanel, { Transformer } from "@components/ConversionPanel";
import { Alert, Badge, Heading, Pane } from "evergreen-ui";
import svgToDataUrl from "svg-to-dataurl";

interface SvgConverterProps {
  name: string;
  babelWorker?: any;
  transformer: Transformer;
  formFields: any;
  resultTitle: string;
  optimizedValue: string;
  settings: any;
  setSettings: (settings: any) => void;
}

export const SvgConverter: React.FunctionComponent<SvgConverterProps> = ({
  transformer,
  resultTitle,
  formFields,
  settings,
  setSettings
}) => {
  const getSettingsPanel = useCallback<EditorPanelProps["settingElement"]>(
    ({ open, toggle }) => {
      return (
        <Form<Partial<Settings>>
          initialValues={settings}
          open={open}
          toggle={toggle}
          title={"SVGO Settings"}
          onSubmit={setSettings}
          formsFields={formFields}
        />
      );
    },
    []
  );

  return (
    <ConversionPanel
      transformer={transformer}
      editorTitle="SVG"
      resultLanguage="javascript"
      resultTitle={resultTitle}
      editorLanguage="html"
      editorDefaultValue="svg"
      settings={settings}
      editorProps={{
        settingElement: getSettingsPanel,
        topNotifications: ({ toggleSettings }) =>
          settings.optimizeSvg && (
            <Alert
              intent="warning"
              backgroundColor="#FEF8E7"
              title={
                <>
                  SVGO 优化已启用. 您可以在{" "}
                  <Heading
                    size={400}
                    is="a"
                    color={"blue"}
                    onClick={toggleSettings}
                  >
                    转换配置
                  </Heading>
                  中关闭或配置它
                </>
              }
            />
          )
      }}
    />
  );
};
