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

// 포스트 소프트 삭제 및 조회 & 복구
router.patch('/myMoodPosts/:post_id/soft-delete', controller.softDeleteMood);

router.get('/myMoodPosts/view/deletedMoodList', controller.getDeletedMoodList);

router.get(
  '/myMoodPosts/view/deletedMoodList/:post_id',
  controller.getOneDeletedMoodPost,
);

router.patch(
  '/myMoodPosts/view/deletedMoodList/:post_id/restore',
  controller.patchRestoreMood,
);

router.delete(
  '/myMoodPosts/view/deletedMoodList/:post_id/permanent-delete',
  controller.hardDeleteMood,
);

// 마이페이지 - 좋아요
router.get('/likes', controller.getMyLikedMood);

// 마이페이지 - 북마크
router.get('/marks', controller.getMyMarkedMood);

module.exports = router;
