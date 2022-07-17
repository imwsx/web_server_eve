const express = require("express");
const cors = require("cors");
const { expressjwt: expressJwt } = require("express-jwt");

const userRouter = require("./router/user");
const userinfoRouter = require("./router/userinfo");
const artCateRouter = require("./router/artcate");
const artRouter = require("./router/article");
const config = require("./config");
const PORT = 8081;

const app = express();

app.use(cors());

// 配置解析表单数据中间件, 只能解析 application/x-www-form-urlencoded 格式表单数据
app.use(express.urlencoded({ extended: false }));

// 托管静态资源 中间件
app.use('/uploads', express.static('./uploads'));

// 响应处理失败中间件
app.use(function (req, res, next) {
  res.cc = (err, status = 1) => {
    res.send({
      status,
      message: err instanceof Error ? err.message : err,
    });
  };
  next();
});

// token 身份认证
app.use(
  expressJwt({ secret: config.jwtSecertKey, algorithms: ["HS256"] }).unless({
    path: [/^\/api/],
  })
);

// 用户注册登录路由规则
app.use("/api", userRouter);

// 获取更新用户信息路由规则
app.use("/my", userinfoRouter);

// 获取文章分类路由规则
app.use("/my/article", artCateRouter);

// 文章发布路由规则
app.use("/my/article", artRouter);

// 全局错误处理函数中间件
app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    return res.cc("身份认证失败!");
  }
});

app.listen(PORT, () => {
  console.log("Server runing on http://127.0.0.1:8081");
});
