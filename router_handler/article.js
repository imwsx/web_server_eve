const db = require("../db/index");
const path = require("path");

exports.addArt = (req, res) => {
  // 1. 判断是否上传文章封面
  if (!req.file || req.file.fieldname !== "cover_img") {
    return res.cc("文章封面是必选参数!");
  }

  //   2. 验证数据合法性
  //    处理文章信息对象
  const articleInfo = {
    ...req.body,
    cover_img: path.join("/uploads", req.file.filename),
    pub_date: new Date(),
    author_id: req.auth.id,
  };

  const insertSql = "insert into eve_article set ?";
  db.query(insertSql, articleInfo, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    if (results.affectedRows !== 1) {
      return res.cc("发布文章失败!");
    }
    res.cc('发布文章成功!', 0);
  });
};
