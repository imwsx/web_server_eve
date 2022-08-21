const express = require("express");
const proTcHandler = require("../router_handler/protc");

const router = express.Router();

router.get("/tcs", proTcHandler.getProTc);

router.get("/tcs/:id", proTcHandler.getProTcById);

router.post("/addtc", proTcHandler.addProTc);

router.get("/deletetc/:id", proTcHandler.deleteTcById);

router.post("/updatetc", proTcHandler.updateTcById);

module.exports = router;
