const db = require("../db/index");

exports.getProTc = async (req, res) => {
  const selectSql =
    "select a.id, a.tc_module, a.tc_title, a.tc_pre, a.tc_step, a.tc_exp, a.tc_remark, a.tc_pr, a.edittime, a.tc_status, a.is_lock from eve_tc as a where a.is_delete=0 limit ?,?";
  let results = [];
  try {
    results = await db.queryByPromisify(selectSql, [
      (req.query.page - 1) * req.query.limit,
      parseInt(req.query.limit),
    ]);
  } catch (err) {
    return res.cc(err);
  }

  const countSql = "select count(*) as num from eve_tc where is_delete = 0";
  let total = null;
  try {
    let [{ num }] = await db.queryByPromisify(countSql);
    total = num;
  } catch (err) {
    return res.cc(err);
  }
  res.send({
    status: 0,
    message: "获取用例成功!",
    data: results,
    total,
  });
};

exports.getProTcByStatus = async (req, res) => {
  const countSql =
    `select (select count(*) from eve_tc where is_delete = 0) as a,
    (select count(*) from eve_tc where is_delete = 0 and tc_status = '1') as b,
     (select count(*) from eve_tc where is_delete = 0 and tc_status = '2') as c, 
     (select count(*) from eve_tc where is_delete = 0 and tc_status = '3') as d,
     (select count(*) from eve_tc where is_delete = 0 and tc_status = '4') as e,
     (select count(*) from eve_tc where is_delete = 0 and tc_status = '0') as f,
     (select count(*) from eve_tc where is_delete = 0 and is_lock = '1') as g`;
  let total = null;
  try {
    let [{ a, b, c, d, e, f, g }] = await db.queryByPromisify(countSql);
    total = [a, b, c, d, e, f, g];
  } catch (err) {
    return res.cc(err);
  }
  res.send({
    status: 0,
    message: "获取通过用例状态数成功!",
    total,
  });
};

exports.getProTcByPr = async (req, res) => {
  const countSql =
    `select (select count(*) from eve_tc where is_delete = 0 and tc_pr = 0) as a,
     (select count(*) from eve_tc where is_delete = 0 and tc_pr = 1) as b, 
     (select count(*) from eve_tc where is_delete = 0 and tc_pr = 2) as c`;
  let total = null;
  try {
    let [{ a, b, c }] = await db.queryByPromisify(countSql);
    total = [a, b, c];
  } catch (err) {
    return res.cc(err);
  }
  res.send({
    status: 0,
    message: "获取通过用例优先级数成功!",
    total,
  });
};

exports.getProTcById = (req, res) => {
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

exports.addProTc = (req, res) => {
  // 1. 查重, 是否占用
  const selectSql = "select * from eve_tc where tc_title=?";
  db.query(selectSql, req.body.tc_title, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    if (results.length === 2) {
      return res.cc("用例标题被占用（跨行占用）!");
    }
    if (results.length === 1 && results[0].tc_title === req.body.tc_title) {
      return res.cc("用例标题被占用,请重新输入!");
    }

    //   2. 新增产品分类
    const insertSql = "insert into eve_tc set ?";
    db.query(insertSql, req.body, (err, results) => {
      if (err) {
        return res.cc(err);
      }
      if (results.affectedRows !== 1) {
        return res.cc("新增用例失败!");
      }
      res.cc("新增用例成功!", 0);
    });
  });
};

exports.deleteTcById = (req, res) => {
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

exports.updateTcById = (req, res) => {
  // 更新用例
  const updateSql = "update eve_tc set ? where id=?";
  db.query(updateSql, [req.body, req.body.id], (err, results) => {
    if (err) {
      return res.cc(err);
    }
    if (results.affectedRows !== 1) {
      return res.cc("更新用例失败!");
    }
    res.cc("更新用例成功", 0);
  });
};
