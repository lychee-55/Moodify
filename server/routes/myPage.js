const express = require('express');
const router = express.Router();
const controller = require('../controller/CmyPage');
const upload = require('../middlewares/uploads.js'); // 업로드 미들웨어

router.get('/myMoodPosts', controller.getMyMoodPostList);

router.get('/myMoodPosts/:post_id', controller.getMyMoodPostDetail);

router.patch(
  '/myMoodPosts/:post_id/edit',
  upload.single('image'),
  controller.patchMood,
);

router.delete('/:post_id', controller.softDeleteMood);

router.delete('/permanent/:post_id', controller.hardDeleteMood);

router.patch('/restore/:post_id', controller.patchRestoreMood);

// 마이페이지 - 좋아요
router.get('/likes', controller.getMyLikedMood);

// 마이페이지 - 북마크
router.get('/marks', controller.getMyMarkedMood);

module.exports = router;
