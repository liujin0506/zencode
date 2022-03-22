import { NextApiRequest, NextApiResponse } from "next";
import request from "@utils/request";

export default (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { value, settings } = req.body;
    const x = request("http://tool.storyun.com/api/v1/sql2gorm", {
      sql: value,
      col_prefix: settings.col_prefix,
      table_prefix: settings.table_prefix,
      json_tag: settings.json_tag,
      package: settings.package,
      no_null: settings.no_null,
      null_style: settings.null_style,
      gorm_type: settings.gorm_type
    }).then(x => {
      if (x.code === 200) {
        res.status(200).send(x.data.FileStr);
      } else {
        res.status(500).send(x.msg);
      }
    });
  } catch (e) {
    res.status(500).send(e.message);
  }
};
