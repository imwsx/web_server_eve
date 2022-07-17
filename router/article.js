const express = require("express");
const artHandler = require("../router_handler/article");

// formdata 格式表单（涉及到图片上传） express 提供 multer 中间件用于处理 Multipart/form-data 数据
const multer = require("multer");
const path = require("path");

const router = express.Router();


/* 
 * 创建 multer 实例
    * 添加dest属性，写入指定文件，否则仅写入内存
    * 文件存入 uploads
*/
const upload = multer({ dest: path.join(__dirname, "../uploads") });


/* 
 * 发布文章路由
    * upload.single() 局部生效中间件, 解析 form-data 格式的表单数据 (对应字段名称)
    * 文件类型数据，挂载到 req.file 属性中
    * 文本类型数据，挂载到 req.body 属性中
*/
// 
router.post("/add", upload.single('cover_img'), artHandler.addArt);

module.exports = router;
