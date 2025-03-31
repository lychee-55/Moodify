const db = require('../models');
const express = require('express');
const bcrypt = require('bcrypt');
const axios = require('axios');
const Posts = require('../models/Posts');
const Likes = require('../models/Likes');
const Marks = require('../models/Marks');

exports.postCreateMood = (req, res) => {};
exports.patchMood = (req, res) => {};
exports.softDeleteMood = (req, res) => {};
exports.hardDeleteMood = (req, res) => {};
exports.patchRestoreMood = (req, res) => {};
exports.postIncreaseLike = (req, res) => {};
exports.patchLikeQuantity = (req, res) => {};
exports.postIncreaseMark = (req, res) => {};
exports.patchMarkQuantity = (req, res) => {};
exports.getAllMoodList = (req, res) => {};
exports.getOneMoodList = (req, res) => {};
exports.getPopularMoods = (req, res) => {};
exports.getFilteredMood = (req, res) => {};
exports.getMyLikedMood = (req, res) => {};
exports.getMyMarkedMood = (req, res) => {};

// 주간 좋아요 필터링
const getTopLikedPosts = async period => {
  let dateCondition = {};

  // 이번 주(week) 또는 이번 달(month)의 데이터 필터링
  if (period === 'week') {
    dateCondition = {
      createdAt: {
        [Op.gte]: sequelize.literal('DATE_SUB(NOW(), INTERVAL 1 WEEK)'),
      },
    };
  } else if (period === 'month') {
    dateCondition = {
      createdAt: {
        [Op.gte]: sequelize.literal('DATE_SUB(NOW(), INTERVAL 1 MONTH)'),
      },
    };
  }

  const topPosts = await Like.findAll({
    attributes: [
      'postId',
      [sequelize.fn('SUM', sequelize.col('likes')), 'totalLikes'],
    ],
    include: [
      {
        model: Post,
        attributes: ['title', 'createdAt'], // 게시글 제목과 생성 날짜 가져오기
        where: dateCondition, // 특정 기간(주/월)으로 필터링
      },
    ],
    group: ['postId', 'Post.id'],
    order: [[sequelize.literal('totalLikes'), 'DESC']], // 좋아요 수 내림차순 정렬
    limit: 5, // TOP 5 게시글만 가져오기
  });

  return topPosts;
};

//좋아요 증가 및 감소
const incrementLike = async postId => {
  const postLike = await Like.findOne({ where: { postId } });

  if (postLike) {
    await postLike.increment('likes', { by: 1 }); // 1 증가
  } else {
    await Like.create({ postId, likes: 1 });
  }
};

const decrementLike = async postId => {
  const postLike = await Like.findOne({ where: { postId } });

  if (postLike && postLike.likes > 0) {
    await postLike.decrement('likes', { by: 1 }); // 1 감소
  }
};

//특정 게시글의 좋아요 개수 조회
const getLikeCount = async postId => {
  const postLike = await Like.findOne({
    where: { postId },
    attributes: ['likes'],
  });

  return postLike ? postLike.likes : 0;
};
