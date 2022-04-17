import React from "react";
import flatten from "lodash/flatten";
import find from "lodash/find";

export const categorizedRoutes = [
  {
    category: "JSON",
    content: [
      {
        label: "JSON 格式化",
        path: "/json-to-formatter",
        title: "Zencode | Json Formatter.",
        keyword:
          "在线,JSON,JSON 校验,格式化,xml转json 工具,在线工具,json视图,json 格式化,json格式化工具,json字符串格式化,json 在线查看器,json在线,json 在线验证,json tools online,json解析",
        desc: "在线json格式化工具,在线格式化json"
      },
      {
        label: "JSON To MySQL Schema",
        path: "/json-to-mysql",
        packageName: "generate-schema",
        packageUrl: "https://github.com/nijikokun/generate-schema",
        keyword: "在线,JSON,json转mysql,在线工具,json to mysql"
      },
      {
        label: "JSON To Go Struct",
        path: "/json-to-go",
        packageName: "json-to-go",
        packageUrl: "https://github.com/mholt/json-to-go",
        keyword: "在线,JSON,json转go,在线工具,json to go"
      },
      {
        label: "JSON To Protobuf",
        path: "/json-to-protobuf",
        packageName: "json-protobuf",
        packageUrl: "https://github.com/okdistribute/jsonschema-protobuf",
        keyword: "在线,JSON,json转pb,在线工具,json to protobuf,json转proto"
      },
      {
        label: "JSON To YAML",
        path: "/json-to-yaml",
        packageName: "json2yaml",
        packageUrl: "https://github.com/jeffsu/json2yaml"
      },
      {
        label: "JSON To JSON Schema",
        path: "/json-to-json-schema",
        packageUrl: "https://www.npmjs.com/package/json_typegen_wasm",
        packageName: "json_typegen_wasm"
      },
      {
        label: "JSON To TOML",
        path: "/json-to-toml",
        packageUrl: "https://www.npmjs.com/package/@iarna/toml",
        packageName: "@iarna/toml"
      },
      {
        label: "JSON To React PropTypes",
        path: "/json-to-proptypes",
        title: "Transform | All important transforms at one place."
      },
      {
        label: "JSON To TypeScript",
        path: "/json-to-typescript",
        packageUrl: "https://www.npmjs.com/package/json_typegen_wasm",
        packageName: "json_typegen_wasm"
      }
    ]
  },
  {
    category: "SQL",
    iconName: "",
    content: [
      {
        label: "MySQL Schema to Gorm",
        path: "/mysql-to-gorm",
        packageName: "Gorm",
        packageUrl: "https://gorm.io/zh_CN/docs/models.html",
        keyword: "在线,SQL,SQL 转换,Gorm",
        desc: "在线SQL转换工具, SQL转换为Gorm"
      }
    ]
  },
  {
    category: "ProtocolBuf",
    iconName: "",
    content: [
      {
        label: "Proto to Doc",
        path: "/proto-to-doc",
        packageName: "Proto",
        packageUrl: "https://github.com/golang/protobuf",
        keyword: "在线,PB,Proto 转换,Gorm",
        desc: "在线生成proto文档"
      },
      {
        label: "Proto 排序",
        path: "/proto-to-reorder",
        packageName: "Proto",
        packageUrl: "https://github.com/golang/protobuf",
        keyword: "在线,PB,Proto 转换,Gorm",
        desc: "在线生成proto文档"
      }
    ]
  },
  {
    category: "Encrypt",
    iconName: "link",
    content: [
      {
        label: "Base64 Encode",
        path: "/encrypt_base64_encode",
        packageName: "Base64",
        packageUrl: "",
        keyword: "在线,Base64加密,Base64解密,base64",
        desc: "在线Base64加密解密"
      },
      {
        label: "Base64 Decode",
        path: "/encrypt_base64_decode",
        packageName: "Base64",
        packageUrl: "",
        keyword: "在线,Base64加密,Base64解密,base64",
        desc: "在线Base64加密解密"
      },
      {
        label: "Md5",
        path: "/encrypt_md5",
        packageName: "Md5",
        packageUrl: "",
        keyword: "在线,md5加密,Base64解密,base64",
        desc: "在线md5加密"
      }
    ]
  },
  {
    category: "Others",
    iconName: "",
    content: [
      {
        label: "XML to JSON",
        path: "/xml-to-json",
        packageName: "xml-js",
        packageUrl: "https://github.com/nashwaan/xml-js"
      },
      {
        label: "YAML to JSON",
        path: "/yaml-to-json",
        packageName: "yaml",
        packageUrl: "https://github.com/tj/js-yaml"
      },
      {
        label: "YAML to TOML",
        path: "/yaml-to-toml"
      },
      {
        label: "Markdown to HTML",
        path: "/markdown-to-html",
        packageName: "markdown",
        packageUrl: "https://github.com/evilstreak/markdown-js"
      },
      {
        label: "TOML to JSON",
        path: "/toml-to-json",
        packageUrl: "https://www.npmjs.com/package/@iarna/toml",
        packageName: "@iarna/toml"
      },
      {
        label: "TOML to YAML",
        path: "/toml-to-yaml"
      }
    ]
  }
];

export interface Route {
  path: string;
  label: string;
  keyword: string;
  desc: string;
}

export const routes = flatten(
  categorizedRoutes.map(a =>
    // @ts-ignore
    a.content.map(x => {
      const _label =
        a.category.toLowerCase() !== "others" ? `${x.label}` : x.label;
      return {
        ...x,
        category: a.category,
        searchTerm: _label,
        keyword: a.category + "在线转换工具," + x.keyword,
        desc: x.desc || `${_label}在线转换工具`
      };
    })
  )
);

export function activeRouteData(
  pathname
): {
  label: string;
  path: string;
  searchTerm: string;
  keyword: string;
  desc: string;
  packageUrl?: string;
  packageName?: string;
} {
  return find(routes, o => o.path === pathname);
}
