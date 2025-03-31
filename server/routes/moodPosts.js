const express = require('express');
const router = express.Router();
const controller = require('../controller/CmoodPost.js');

// 게시글 CRUD
router.post('/create', controller.postCreateMood);

router.patch('/edit/:post_ideate', controller.patchMood);

router.delete('/:post_id', controller.softDeleteMood);

router.delete('/permanent/:post_id', controller.hardDeleteMood);

router.patch('/restore/:post_id', controller.patchRestoreMood);

// 게시글 좋아요
router.post('/:post_id/like', controller.postIncreaseLike);

router.patch('/:post_id/like', controller.patchLikeQuantity);

// 게시글 북마크
router.post('/:post_id/mark', controller.postIncreaseMark);

router.patch('/:post_id/mark', controller.patchMarkQuantity);

// 게시글 전체 조회
router.get('/view/moodListate', controller.getAllMoodList);

// 게시글 특정 하나 조회
router.get('/view/:post_id', controller.getOneMoodList);

// 이번달 베스트 조회
router.get('/view/popularMood', controller.getPopularMoods);

// 게시글 필터링 조회
router.get('/view/:filter', controller.getFilteredMood);

// 마이페이지 - 좋아요
router.get('/mypage/likes', controller.getMyLikedMood);

// 마이페이지 - 북마크
router.get('/mypage/marks', controller.getMyMarkedMood);

module.exports = router;
