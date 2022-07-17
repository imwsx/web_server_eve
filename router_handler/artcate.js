const db = require("../db/index");

exports.getArtCates = (req, res) => {
  const selectSql =
    "select * from eve_article_cate where is_delete=0 order by id asc";
  db.query(selectSql, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    res.send({
      status: 0,
      message: "获取文章分类成功!",
      data: results,
    });
  });
};

exports.getArtCateById = (req, res) => {
  const selectSql = "select * from eve_article_cate where id=?";
  db.query(selectSql, req.params.id, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    if (results.length !== 1) {
      return res.cc("获取文章分类失败!");
    }

    // 注意 sql 语句查询结果中 的 id 为 数字型, params 中的为字符串
    if (results[0].id == req.params.id && results[0].is_delete === 1) {
      return res.cc("该文章分类已被删除!");
    }
    res.send({
      status: 0,
      message: "获取文章分类成功",
      data: results[0],
    });
  });
};

exports.addArtCate = (req, res) => {
  // 1. 查重, 是否占用
  const selectSql = "select * from eve_article_cate where name=? or alias=?";
  db.query(selectSql, [req.body.name, req.body.alias], (err, results) => {
    if (err) {
      return res.cc(err);
    }
    if (results.length === 2) {
      return res.cc("分类名、分类别名被占用（跨行占用）!");
    }
    if (
      results.length === 1 &&
      results[0].name === req.body.name &&
      results[0].alias === req.body.alias
    ) {
      return res.cc("分类名、分类别名被占用!");
    }
    if (results.length === 1 && results[0].name === req.body.name) {
      return res.cc("分类名被占用,请重新更换!");
    }
    if (results.length === 1 && results[0].alias === req.body.alias) {
      return res.cc("分类别名被占用,请重新更换!");
    }

    //   2. 新增文章分类
    const insertSql = "insert into eve_article_cate set ?";
    db.query(insertSql, req.body, (err, results) => {
      if (err) {
        return res.cc(err);
      }
      if (results.affectedRows !== 1) {
        return res.cc("新增文章分类失败!");
      }
      res.cc("新增文章分类成功!", 0);
    });
  });
};

exports.deleteArtCateById = (req, res) => {
  const updateSql = "update eve_article_cate set is_delete=1 where id=?";

  //   req.params
  // 所对应的url长这个样子 http://localhost:3000/1
  // 就是把请求 / 后面的参数当成id，通过req.params就能获取到id，返回页面也就是10
  //   不需要写 params 直接在后面 加上 id

  //   req.query
  // 对应的url长这个样子http://localhost:3000/?id=10
  //   需要写 params

  db.query(updateSql, req.params.id, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    if (results.affectedRows !== 1) {
      return res.cc("删除文章分类失败!");
    }
    res.cc("删除文章分类成功!", 0);
  });
};

exports.updateArtCateById = (req, res) => {
  // 1. 查重, 查看非本 id 是否占用分类名或分类别名
  const selectSql =
    "select * from eve_article_cate where id<>? and (name=? or alias=?)";

  db.query(
    selectSql,
    [req.body.id, req.body.name, req.body.alias],
    (err, results) => {
      if (err) {
        return res.cc(err);
      }
      if (results.length === 2) {
        return res.cc("分类名、分类别名被占用（跨行占用）!");
      }
      if (
        results.length === 1 &&
        results[0].name === req.body.name &&
        results[0].alias === req.body.alias
      ) {
        return res.cc("分类名、分类别名被占用!");
      }
      if (results.length === 1 && results[0].name === req.body.name) {
        return res.cc("分类名被占用,请重新更换!");
      }
      if (results.length === 1 && results[0].alias === req.body.alias) {
        return res.cc("分类别名被占用,请重新更换!");
      }

      //   2. 更新文章分类
      const updateSql = "update eve_article_cate set ? where id=?";
      db.query(updateSql, [req.body, req.body.id], (err, results) => {
        if (err) {
          return res.cc(err);
        }
        if (results.affectedRows !== 1) {
          return res.cc("更新文章分类失败!");
        }
        res.cc("更新文章分类成功", 0);
      });
    }
  );
};
