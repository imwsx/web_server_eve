const db = require("../db/index");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");

exports.regUser = (req, res) => {
  // 1. 表单数据合法性校验
  const userinfo = req.body;
  if (!userinfo.username || !userinfo.password) {
    return res.cc("用户名或密码不合法!");
  }

  //2. 检查用户名是否占用
  const selectSql = "select * from eve_users where username=?";
  db.query(selectSql, userinfo.username, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    if (results.length > 0) {
      return res.cc("用户名已被占用，请重新更换用户名!");
    }

    //3. 密码加密处理(bcryptjs)
    // hashSync(明文密码, 随机盐长度)
    userinfo.password = bcrypt.hashSync(userinfo.password, 10);

    //4. 插入新用户
    const insertSql = "insert into eve_users set ?";
    db.query(
      insertSql,
      { username: userinfo.username, password: userinfo.password },
      (err, results) => {
        console.log(results);
        if (err) {
          return res.cc(err);
        }
        if (results.affectedRows !== 1) {
          return res.cc("用户注册失败。请稍后重试!");
        }
        res.cc("用户注册成功!", 0);
      }
    );
  });
};

exports.login = (req, res) => {
  const userinfo = req.body;

  // 1. 根据用户名查询用户数据
  const selectSql = "select * from eve_users where username=?";
  db.query(selectSql, userinfo.username, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    if (results.length !== 1) {
      return res.cc("登录失败!");
    }

    // 2. 判断用户输入密码是否正确
    // 核心思路: bcrypt.compareSync(用户提交的密码, 数据库中的密码) 返回 bool
    const comparePwd = bcrypt.compareSync(
      userinfo.password,
      results[0].password
    );

    if (!comparePwd) {
      // TODO： 此处存在问题点（未使用 bcrypt 加密算法前的密码，未来登录验证比较时总是返回 false）
      return res.cc("输入的密码不正确!");
    }
    // 3. 在服务端生成 Token字符串
    const user = { ...results[0], password: "", user_pic: "" };
    const tokenStr = jwt.sign(user, config.jwtSecertKey, {
      expiresIn: config.expiresIn,
    });
    res.send({
      status: 0,
      message: "登录成功!",
      token: "Bearer " + tokenStr,
    });
  });
};
