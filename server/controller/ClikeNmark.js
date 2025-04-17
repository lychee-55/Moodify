// -- Active: 1732688863205@@127.0.0.1@3306@moodify
const db = require('../models');
const express = require('express');
const axios = require('axios');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const { Post, Music, User, PostLike, Bookmark } = db;
const responseUtil = require('../utils/responseUtil');

exports.postIncreaseLike = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res
      .status(401)
      .send(responseUtil('ERROR', '로그인 상태가 아닙니다.', null));
  }

  try {
    const sessionUser = req.session.passport.user.user_id;
    const { post_id } = req.body;

    if (!sessionUser) {
      return res.send(
        responseUtil('ERROR', '가입된 사용자만 사용 가능합니다.', null),
      );
    }

    const [like, created] = await PostLike.findOrCreate({
      where: { user_id: sessionUser, post_id },
      defaults: { status: 'active' },
    });

    if (!created && like.status === 'inactive') {
      like.status = 'active';
      await like.save();

      // 좋아요 수 증가
      await Post.increment('likes_count', {
        by: 1,
        where: { post_id },
      });
    } else if (created) {
      // 새로 생성된 경우 좋아요 수 증가
      await Post.increment('likes_count', {
        by: 1,
        where: { post_id },
      });
    }

    const totalLikes = await PostLike.count({
      where: { post_id, status: 'active' },
    });

    return res.send(
      responseUtil('SUCCESS', '좋아요 반영 완료', { totalLikes }),
    );
  } catch (err) {
    console.error(err);
    return res.send(responseUtil('ERROR', '좋아요 처리 중 오류 발생', null));
  }
};

exports.patchLikeQuantity = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res
      .status(401)
      .send(responseUtil('ERROR', '로그인 상태가 아닙니다.', null));
  }

  try {
    const sessionUser = req.session.passport.user.user_id;
    const { post_id } = req.body;

    if (!sessionUser) {
      return res.send(
        responseUtil('ERROR', '가입된 사용자만 사용 가능합니다.', null),
      );
    }

    const like = await PostLike.findOne({
      where: { user_id: sessionUser, post_id },
    });

    if (!like) {
      return res.send(
        responseUtil('ERROR', '좋아요 정보가 존재하지 않습니다.', null),
      );
    }

    if (like.status === 'active') {
      like.status = 'inactive';
      await like.save();

      // 좋아요 수 감소 (최소 0)
      const post = await Post.findByPk(post_id);
      if (post.likes_count > 0) {
        await Post.decrement('likes_count', {
          by: 1,
          where: { post_id },
        });
      }
    } else {
      like.status = 'active';
      await like.save();

      // 좋아요 수 증가
      await Post.increment('likes_count', {
        by: 1,
        where: { post_id },
      });
    }

    const totalLikes = await PostLike.count({
      where: { post_id, status: 'active' },
    });

    return res.send(
      responseUtil('SUCCESS', '좋아요 상태 변경 완료', { totalLikes }),
    );
  } catch (err) {
    console.error(err);
    return res.send(responseUtil('ERROR', '좋아요 상태 변경 중 오류 발생'));
  }
};

exports.postIncreaseMark = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res
      .status(401)
      .send(responseUtil('ERROR', '로그인 상태가 아닙니다.', null));
  }

  try {
    const sessionUser = req.session.passport.user.user_id;
    const { post_id } = req.body;

    const existingBookmark = await Bookmark.findOne({
      where: { user_id: sessionUser, post_id },
    });

    if (!existingBookmark) {
      await Bookmark.create({
        user_id: sessionUser,
        post_id,
        status: 'active',
      });
    } else if (existingBookmark.status === 'inactive') {
      await existingBookmark.update({ status: 'active' });
    }

    return res
      .status(200)
      .send(responseUtil('SUCCESS', '북마크 저장 완료', { bookmarked: true }));
  } catch (error) {
    console.error(error);
    return res.status(500).send(responseUtil('ERROR', '서버 오류 발생'));
  }
};

exports.patchMarkQuantity = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res
      .status(401)
      .send(responseUtil('ERROR', '로그인 상태가 아닙니다.', null));
  }

  try {
    const sessionUser = req.session.passport.user.user_id;
    const { post_id } = req.body;

    const bookmark = await Bookmark.findOne({
      where: { user_id: sessionUser, post_id, status: 'active' },
    });

    if (!bookmark) {
      return res.status(400).send(responseUtil('ERROR', '북마크가 없습니다.'));
    }

    await bookmark.update({ status: 'inactive' });

    return res.send(
      responseUtil('SUCCESS', '북마크 취소 완료', { bookmarked: false }),
    );
  } catch (error) {
    console.error(error);
    return res.status(500).send(responseUtil('ERROR', '서버 오류 발생'));
  }
};

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
