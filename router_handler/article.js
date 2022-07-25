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
    res.cc("发布文章成功!", 0);
  });
};

exports.getAllArt = async (req, res) => {
  const query = req.query;
  const selectSql = `select a.id, a.title, a.pub_date, a.state, b.name from eve_article as a, eve_article_cate as b where a.cate_id=b.id and a.cate_id=ifnull(?, a.cate_id) and a.state=ifnull(?, a.state) and a.is_delete=0 limit ?,?`;
  let results = [];

  try {
    results = await db.queryByPromisify(selectSql, [
      query.cate_id || null,
      query.state || null,
      (query.pagenum - 1) * query.pagesize,
      // 注意这里 mysql limit 限制接收 数字型
      +query.pagesize,
    ]);
  } catch (err) {
    return res.cc(err);
  }

  const countSql =
    "select count(*) as num from eve_article where is_delete = 0 and state = ifnull(?, state) and cate_id = ifnull(?, cate_id)";
  let total = null;
  try {
    let [{ num }] = await db.queryByPromisify(countSql, [
      query.cate_id || null,
      query.state || null,
    ]);
    total = num;
  } catch (err) {
    return res.cc(err);
  }

  res.send({
    status: 0,
    message: "文章列表获取成功",
    data: results,
    total,
  });
};
