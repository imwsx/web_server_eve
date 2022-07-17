const express = require('express');
const userinfoHandler = require('../router_handler/userinfo');
const router = express.Router();

router.get('/userinfo', userinfoHandler.getUserinfo);

router.post('/userinfo', userinfoHandler.updateUserinfo);

router.post('/updatepwd', userinfoHandler.updatePassword);

router.post('/update/avatar', userinfoHandler.postAvatar);

module.exports = router;