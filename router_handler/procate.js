const db = require("../db/index");

exports.getProCates = (req, res) => {
  const selectSql =
    "select * from eve_pro_cate where is_delete=0 order by id asc";
  db.query(selectSql, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    res.send({
      status: 0,
      message: "获取产品分类成功!",
      data: results,
    });
  });
};

exports.getProCateById = (req, res) => {
  const selectSql = "select * from eve_pro_cate where id=?";
  db.query(selectSql, req.params.id, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    if (results.length !== 1) {
      return res.cc("获取产品分类失败!");
    }

    // 注意 sql 语句查询结果中 的 id 为 数字型, params 中的为字符串
    if (results[0].id == req.params.id && results[0].is_delete === 1) {
      return res.cc("该产品分类已被删除!");
    }
    res.send({
      status: 0,
      message: "获取产品分类成功",
      data: results[0],
    });
  });
};

exports.addProCate = (req, res) => {
  // 1. 查重, 是否占用
  const selectSql = "select * from eve_pro_cate where pro_model=? or pro_name=?";
  db.query(selectSql, [req.body.pro_model, req.body.pro_name], (err, results) => {
    if (err) {
      return res.cc(err);
    }
    if (results.length === 2) {
      return res.cc("产品型号、产品名称被占用（跨行占用）!");
    }
    if (
      results.length === 1 &&
      results[0].pro_model === req.body.pro_model &&
      results[0].pro_name === req.body.pro_name
    ) {
      return res.cc("产品型号、产品名称被占用!");
    }
    if (results.length === 1 && results[0].pro_model === req.body.pro_model) {
      return res.cc("产品型号被占用,请重新更换!");
    }
    if (results.length === 1 && results[0].pro_name === req.body.pro_name) {
      return res.cc("产品名称被占用,请重新更换!");
    }

    //   2. 新增产品分类
    const insertSql = "insert into eve_pro_cate set ?";
    db.query(insertSql, req.body, (err, results) => {
      if (err) {
        return res.cc(err);
      }
      if (results.affectedRows !== 1) {
        return res.cc("新增产品分类失败!");
      }
      res.cc("新增产品分类成功!", 0);
    });
  });
};

exports.deleteProCateById = (req, res) => {
  const updateSql = "update eve_pro_cate set is_delete=1 where id=?";

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
      return res.cc("删除产品分类失败!");
    }
    res.cc("删除产品分类成功!", 0);
  });
};

exports.updateProCateById = (req, res) => {
  // 1. 查重, 查看非本 id 是否占用分类名或分类别名
  const selectSql =
    "select * from eve_pro_cate where id<>? and (pro_model=? or pro_name=?)";

  db.query(
    selectSql,
    [req.body.id, req.body.pro_model, req.body.pro_name],
    (err, results) => {
      if (err) {
        return res.cc(err);
      }
      if (results.length === 2) {
        return res.cc("产品型号、产品名称被占用（跨行占用）!");
      }
      if (
        results.length === 1 &&
        results[0].pro_model === req.body.pro_model &&
        results[0].pro_name === req.body.pro_name
      ) {
        return res.cc("产品型号、产品名称被占用!");
      }
      if (results.length === 1 && results[0].pro_model === req.body.pro_model) {
        return res.cc("产品型号被占用,请重新更换!");
      }
      if (results.length === 1 && results[0].pro_name === req.body.pro_name) {
        return res.cc("产品名称被占用,请重新更换!");
      }

      //   2. 更新文章分类
      const updateSql = "update eve_pro_cate set ? where id=?";
      db.query(updateSql, [req.body, req.body.id], (err, results) => {
        if (err) {
          return res.cc(err);
        }
        if (results.affectedRows !== 1) {
          return res.cc("更新产品分类失败!");
        }
        res.cc("更新产品分类成功", 0);
      });
    }
  );
};
