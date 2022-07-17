const db = require("../db/index");
const bcrypt = require('bcryptjs');

exports.getUserinfo = (req, res) => {
  // 错误点: 并不需要指定id, 注册用户后生成的 token 中包含id信息, 只需要保证 authorization 中存在 token 即可
  //   const query = req.query;(无需从参数中获取 id)

  //   请求对象中设置有效负载的属性的名称, 默认为req.auth
  const auth = req.auth;

  //   排除敏感信息 密码 password
  const selectSql =
    "select id, username, nickname, email, user_pic from eve_users where id=?";

  db.query(selectSql, auth.id, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    if (results.length !== 1) {
      return res.cc("用户信息获取失败!");
    }

    res.send({
      status: 0,
      message: "用户信息获取成功",
      data: results[0],
    });
  });
};

exports.updateUserinfo = (req, res) => {
  const updateSql = "update eve_users set  ? where id=?";
  db.query(updateSql, [req.body, req.auth.id], (err, results) => {
    if (err) {
      return res.cc(err);
    }
    if (results.affectedRows !== 1) {
      return res.cc("修改用户基本信息失败!");
    }
    res.cc("修改用户基本信息成功!", 0);
  });
};

exports.updatePassword = (req, res) => {
  //  查询用户
  const selectSql = "select * from eve_users where id=?";
  console.log(req.auth.id);
  db.query(selectSql, req.auth.id, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    if (results.length !== 1) {
      return res.cc("该用户不存在!");
    }

    // 判断旧密码是否正确
    const comparePwd = bcrypt.compareSync(req.body.oldPwd, results[0].password);
    if (!comparePwd) {
      return res.cc("原密码错误!");
    }

    const updateSql = "update eve_users set password=? where id=?";
    const newPwd = bcrypt.hashSync(req.body.newPwd, 10);
    db.query(updateSql, [newPwd, req.auth.id], (err, results) => {
      if (err) {
        return res.cc(err);
      }
      if (results.affectedRows !== 1) {
        return res.cc("修改密码失败!");
      }
      res.cc("修改密码成功", 0);
    });
  });
};

exports.postAvatar = (req, res) => {
  const updateSql = "update eve_users set user_pic=? where id=?";
  db.query(updateSql, [req.body.avatar, req.auth.id], (err, results) => {
    if (err) {
      return res.cc(err);
    }
    if (results.affectedRows !== 1) {
      return res.cc("更新头像失败!");
    }
    return res.cc("更新头像成功!", 0);
  });
};
