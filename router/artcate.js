const express = require("express");
const artCateHandler = require("../router_handler/artcate");

const router = express.Router();

router.get("/cates", artCateHandler.getArtCates);

router.get("/cates/:id", artCateHandler.getArtCateById);

router.post("/addcate", artCateHandler.addArtCate);

router.get("/deletecate/:id", artCateHandler.deleteArtCateById);

router.post("/updatecate", artCateHandler.updateArtCateById);

module.exports = router;
