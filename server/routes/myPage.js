const express = require('express');
const router = express.Router();
const controller = require('../controller/CmyPage');

// 마이페이지 - 좋아요
router.get('/mypage/likes', controller.getMyLikedMood);

// 마이페이지 - 북마크
router.get('/mypage/marks', controller.getMyMarkedMood);

module.exports = router;
