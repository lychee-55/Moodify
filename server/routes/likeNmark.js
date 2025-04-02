const express = require('express');
const router = express.Router();
const controller = require('../controller/ClikeNmark');

// 게시글 좋아요
router.post('/:post_id/like', controller.postIncreaseLike);

router.patch('/:post_id/like', controller.patchLikeQuantity);

// 게시글 북마크
router.post('/:post_id/mark', controller.postIncreaseMark);

router.patch('/:post_id/mark', controller.patchMarkQuantity);

module.exports = router;
