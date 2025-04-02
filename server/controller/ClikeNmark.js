// -- Active: 1732688863205@@127.0.0.1@3306@moodify
const db = require('../models');
const express = require('express');
const axios = require('axios');
const Posts = require('../models/Posts');
const PostLikes = require('../models/PostLike');
const Bookmarks = require('../models/Bookmark');

exports.postIncreaseLike = (req, res) => {};

exports.patchLikeQuantity = (req, res) => {};

exports.postIncreaseMark = (req, res) => {};

exports.patchMarkQuantity = (req, res) => {};

// // 주간 좋아요 필터링
// const getTopLikedPosts = async period => {
//   let dateCondition = {};

//   // 이번 주(week) 또는 이번 달(month)의 데이터 필터링
//   if (period === 'week') {
//     dateCondition = {
//       createdAt: {
//         [Op.gte]: sequelize.literal('DATE_SUB(NOW(), INTERVAL 1 WEEK)'),
//       },
//     };
//   } else if (period === 'month') {
//     dateCondition = {
//       createdAt: {
//         [Op.gte]: sequelize.literal('DATE_SUB(NOW(), INTERVAL 1 MONTH)'),
//       },
//     };
//   }

//   const topPosts = await Like.findAll({
//     attributes: [
//       'postId',
//       [sequelize.fn('SUM', sequelize.col('likes')), 'totalLikes'],
//     ],
//     include: [
//       {
//         model: Post,
//         attributes: ['title', 'createdAt'], // 게시글 제목과 생성 날짜 가져오기
//         where: dateCondition, // 특정 기간(주/월)으로 필터링
//       },
//     ],
//     group: ['postId', 'Post.id'],
//     order: [[sequelize.literal('totalLikes'), 'DESC']], // 좋아요 수 내림차순 정렬
//     limit: 5, // TOP 5 게시글만 가져오기
//   });

//   return topPosts;
// };

// //좋아요 증가 및 감소
// const incrementLike = async postId => {
//   const postLike = await Like.findOne({ where: { postId } });

//   if (postLike) {
//     await postLike.increment('likes', { by: 1 }); // 1 증가
//   } else {
//     await Like.create({ postId, likes: 1 });
//   }
// };

// const decrementLike = async postId => {
//   const postLike = await Like.findOne({ where: { postId } });

//   if (postLike && postLike.likes > 0) {
//     await postLike.decrement('likes', { by: 1 }); // 1 감소
//   }
// };

// //특정 게시글의 좋아요 개수 조회
// const getLikeCount = async postId => {
//   const postLike = await Like.findOne({
//     where: { postId },
//     attributes: ['likes'],
//   });

//   return postLike ? postLike.likes : 0;
// };

// const { Like, Post } = require('../models');

// async function getTopLikedPosts() {
//   try {
//     const topPosts = await Like.findAll({
//       attributes: [
//         'post_id',
//         [Sequelize.fn('COUNT', Sequelize.col('post_id')), 'like_count'],
//       ],
//       where: { status: 'active' }, // 활성화된 좋아요만 카운트
//       group: ['post_id'],
//       order: [[Sequelize.literal('like_count'), 'DESC']],
//       limit: 5,
//       include: [
//         {
//           model: Post,
//           attributes: ['title', 'artist', 'song', 'post_image'], // 원하는 게시글 정보 추가
//         },
//       ],
//     });

//     return topPosts;
//   } catch (err) {
//     console.error(err);
//     return [];
//   }
// }
