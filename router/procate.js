const express = require("express");
const proCateHandler = require("../router_handler/procate");

const router = express.Router();

router.get("/cates", proCateHandler.getProCates);

router.get("/cates/:id", proCateHandler.getProCateById);

router.post("/addcate", proCateHandler.addProCate);

router.get("/deletecate/:id", proCateHandler.deleteProCateById);

router.post("/updatecate", proCateHandler.updateProCateById);

module.exports = router;
