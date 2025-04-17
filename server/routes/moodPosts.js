const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploads.js'); // 업로드 미들웨어
const controller = require('../controller/CmoodPost.js');

// 게시글 CRUD
router.post('/create', upload.single('image'), controller.postCreateMood);

router.get('/create/search-music', controller.searchMusic);

// 게시글 전체 조회
router.get('/view/moodList', controller.getAllMoodList);

// 게시글 특정 하나 조회
router.get('/view/:post_id', controller.getOneMoodPost);

router.get(
  '/view/:post_id/search-youtube-audio',
  controller.searchYouTubeAudio,
);

// 이번달 베스트 조회
router.get('/view/popularMood', controller.getPopularMoods);

// 게시글 검색 조회
router.get('/search', controller.getFilteredMood);

module.exports = router;
