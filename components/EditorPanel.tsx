import {
  Button,
  FilePicker,
  Heading,
  HTMLInputEvent,
  IconButton,
  Pane,
  Dialog,
  Popover,
  TextInput,
  toaster,
  Tooltip
} from "evergreen-ui";
import React, { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import copy from "clipboard-copy";
import { useDropzone } from "react-dropzone";

export interface EditorPanelProps {
  editable?: boolean;
  language?: string;
  defaultValue: string;
  title: React.ReactNode;
  hasCopy?: boolean;
  hasPrettier?: boolean;
  hasTrans?: boolean;
  repeatTrans?: (value: string) => void;
  id: string | number;
  onChange?: (value: string) => void;
  hasLoad?: boolean;
  hasClear?: boolean;
  settingElement?: (args: { toggle: () => void; open: boolean }) => JSX.Element;
  alertMessage?: React.ReactNode;
  topNotifications?: (args: {
    toggleSettings: () => void;
    isSettingsOpen: boolean;
  }) => React.ReactNode;
  previewElement?: (value: string) => string;
  acceptFiles?: string | string[];
  packageDetails?: {
    name: string;
    url: string;
  };
}

export interface TransformResult {
  result?: string;
  prettier?: boolean;
  err?: string;
}

const Monaco = dynamic(() => import("../components/Monaco"), {
  ssr: false
});

export default function EditorPanel({
  editable = true,
  title,
  settingElement,
  hasLoad,
  acceptFiles,
  hasClear,
  hasCopy = true,
  topNotifications,
  language,
  defaultValue,
  onChange,
  id,
  packageDetails,
  previewElement,
  hasTrans,
  repeatTrans
}: EditorPanelProps) {
  const [showSettingsDialogue, setSettingsDialog] = useState(false);
  const [showPreviewDialogue, setPreviewDialog] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [fetchingUrl, setFetchingUrl] = useState("");

  const options = {
    fontSize: 13,
    readOnly: !editable,
    codeLens: false,
    fontFamily: "Menlo, Consolas, monospace, sans-serif",
    minimap: {
      enabled: false
    },
    quickSuggestions: false,
    lineNumbers: "on",
    renderValidationDecorations: "off",
    wordWrap: "on",
    scrollbar: {
      vertical: "hidden",
      horizontal: "hidden"
    },
    automaticLayout: true,
    scrollBeyondLastLine: true
  };

  const _toggleSettingsDialog = useCallback(
    () => setSettingsDialog(!showSettingsDialogue),
    [showSettingsDialogue]
  );

  useEffect(() => {
    // @ts-ignore
    window.__webpack_public_path__ = "/_next/static/";
  }, []);

  const getSettings = useCallback(
    () => (
      <>
        <Button
          marginRight={10}
          iconBefore="cog"
          onClick={_toggleSettingsDialog}
          height={28}
        >
          转换配置
        </Button>

        {settingElement({
          toggle: _toggleSettingsDialog,
          open: showSettingsDialogue
        })}
      </>
    ),
    [showSettingsDialogue]
  );

  const onFilePicked = useCallback((files, close = () => {}) => {
    if (!(files && files.length)) return;
    const file = files[0];
    const reader = new FileReader();
    reader.readAsText(file, "utf-8");
    reader.onload = () => {
      setValue(reader.result as string);
      onChange(reader.result as string);
      close();
    };
  }, []);

  const { getRootProps } = useDropzone({
    onDrop: files => onFilePicked(files),
    disabled: !editable,
    accept: acceptFiles,
    onDropRejected: () =>
      toaster.danger("文件类型不支持.", {
        id
      })
  });

  const copyValue = useCallback(() => {
    copy(value);
    toaster.success("复制成功.", {
      id
    });
  }, [value]);

  const transValue = useCallback(() => {
    repeatTrans(value);
  }, [value]);

  const fetchFile = useCallback(
    close => {
      (async () => {
        if (!fetchingUrl) return;
        const res = await fetch(fetchingUrl);
        const value = await res.text();
        setValue(value);
        setFetchingUrl("");
        close();
        onChange(value);
      })();
    },
    [fetchingUrl, onChange]
  );

  // whenever defaultValue changes, change the value of the editor.
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <Pane display="flex" flex={1} flexDirection="column" overflow="hidden">
      <Pane
        display="flex"
        height={40}
        paddingX={10}
        alignItems={"center"}
        borderBottom
        zIndex={2}
        flexShrink={0}
      >
        <Pane flex={1}>
          <Heading size={500} marginTop={0}>
            {title}
          </Heading>
        </Pane>

        {settingElement && getSettings()}

        {hasLoad && (
          <Popover
            content={({ close }) => (
              <Pane
                paddingY={20}
                paddingX={20}
                display="flex"
                flex={1}
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
              >
                <FilePicker
                  width={"100%"}
                  name="filepicker"
                  placeholder="选择文件"
                  onChange={files => onFilePicked(files, close)}
                  accept={acceptFiles}
                />

                <Heading paddingY={10} size={200}>
                  或者
                </Heading>

                <Pane display="flex" flexDirection="row">
                  <TextInput
                    borderBottomRightRadius={0}
                    borderTopRightRadius={0}
                    placeholder="输入文件地址"
                    onChange={(e: HTMLInputEvent) =>
                      setFetchingUrl(e.target.value)
                    }
                  />
                  <Button
                    borderLeftWidth={0}
                    borderBottomLeftRadius={0}
                    borderTopLeftRadius={0}
                    onClick={() => fetchFile(close)}
                  >
                    获取文件
                  </Button>
                </Pane>
              </Pane>
            )}
            shouldCloseOnExternalClick
          >
            <Tooltip content="加载文件">
              <IconButton height={28} marginRight={10} icon="upload" />
            </Tooltip>
          </Popover>
        )}

        {hasTrans && (
          <Button
            appearance="primary"
            intent="success"
            marginRight={10}
            iconBefore="arrow-left"
            onClick={transValue}
            height={28}
          >
            再次转换
          </Button>
        )}

        {hasClear && (
          <Tooltip content="清空">
            <IconButton
              height={28}
              icon="trash"
              intent="danger"
              marginRight={10}
              onClick={() => setValue("")}
            />
          </Tooltip>
        )}

        {packageDetails && (
          <a
            href={packageDetails.url}
            style={{
              display: "inline-flex"
            }}
            target="_blank"
          >
            <Tooltip content={"查看文档: " + packageDetails.name}>
              <IconButton
                height={28}
                icon="link"
                intent="none"
                marginRight={10}
              />
            </Tooltip>
          </a>
        )}

        {hasCopy && (
          <Button
            appearance="primary"
            marginRight={10}
            iconBefore="duplicate"
            onClick={copyValue}
            height={28}
          >
            复制
          </Button>
        )}
        {previewElement && (
          <Button
            appearance="default"
            marginRight={10}
            iconBefore="eye-open"
            onClick={() => {
              setPreviewDialog(true);
            }}
            height={28}
          >
            预览
          </Button>
        )}
        {previewElement && (
          <Dialog
            isShown={showPreviewDialogue}
            title="预览"
            hasCancel={false}
            confirmLabel={"确定"}
            onConfirm={() => {
              setPreviewDialog(false);
            }}
            onCloseComplete={() => {
              setPreviewDialog(false);
            }}
            hasClose={false}
            width={"900px"}
          >
            {previewElement && (
              <div
                dangerouslySetInnerHTML={{ __html: previewElement(value) }}
              />
            )}
          </Dialog>
        )}
      </Pane>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          overflow: "hidden"
        }}
        {...getRootProps()}
      >
        {topNotifications &&
          topNotifications({
            isSettingsOpen: showSettingsDialogue,
            toggleSettings: _toggleSettingsDialog
          })}

        <Monaco
          language={language}
          value={value}
          options={options}
          onChange={value => {
            setValue(value);
            onChange(value);
          }}
        />
      </div>
    </Pane>
  );
}
