const express = require('express');
const router = express.Router();
const controller = require('../controller/CmoodPost.js');

// 게시글 CRUD
router.post('/create', controller.postCreateMood);

router.get('/create/search-music', controller.searchMusic);

router.get('/search-video', controller.searchMusicVideo);

router.patch('/edit/:post_ideate', controller.patchMood);

router.delete('/:post_id', controller.softDeleteMood);

router.delete('/permanent/:post_id', controller.hardDeleteMood);

router.patch('/restore/:post_id', controller.patchRestoreMood);

// 게시글 전체 조회
router.get('/view/moodListate', controller.getAllMoodList);

// 게시글 특정 하나 조회
router.get('/view/:post_id', controller.getOneMoodList);

// 이번달 베스트 조회
router.get('/view/popularMood', controller.getPopularMoods);

// 게시글 필터링 조회
router.get('/view/:filter', controller.getFilteredMood);

module.exports = router;
