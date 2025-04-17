const db = require('../models');
const express = require('express');
const axios = require('axios');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

const { Post, Music, User, PostLike, Bookmark } = db;
const responseUtil = require('../utils/responseUtil');

// router.get('/', controller.getMyMoodPost);
exports.getMyMoodPostList = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res
      .status(401)
      .send(responseUtil('ERROR', '로그인 상태가 아닙니다.', null));
  }

  const page = parseInt(req.query.page) || 1; // 기본값 1
  const limit = parseInt(req.query.limit) || 10; // 기본값 10
  const offset = (page - 1) * limit;

  try {
    const sessionUser = req.session.passport.user.user_id;
    const posts = await Post.findAll({
      where: {
        user_id: sessionUser, // 본인이 작성한 게시글만 조회
      },
      attributes: ['post_id', 'title', 'post_image', 'tags'],
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['user_id', 'profile_image', 'nickname'],
          required: true,
        },
      ],
      order: [['created_at', 'DESC']],
      offset: offset,
      limit: limit,
    });

    const formattedPosts = posts.map(post => ({
      post_id: post.post_id,
      title: post.title,
      post_image: post.post_image,
      tags: post.tags,
      author: {
        user_id: post.author.user_id,
        nickname: post.author.nickname,
        profile_image: post.author.profile_image,
      },
    }));

    return res
      .status(200)
      .send(
        responseUtil('SUCCESS', '내 게시글 목록 조회 성공', formattedPosts),
      );
  } catch (error) {
    console.error('내 게시글 목록 조회 오류:', error);
    return res
      .status(500)
      .send(responseUtil('ERROR', '내 게시글 목록 조회 서버 오류', null));
  }
};

exports.getMyMoodPostDetail = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res
      .status(401)
      .send(responseUtil('ERROR', '로그인 상태가 아닙니다.', null));
  }

  const { post_id } = req.params;
  console.log(post_id);
  try {
    const sessionUser = req.session.passport.user.user_id;

    const post = await Post.findOne({
      where: {
        post_id: post_id,
        // user_id: sessionUser,
      },
      attributes: ['post_id', 'title', 'post_image', 'content', 'tags'],
      include: [
        {
          model: Music,
          as: 'music',
          attributes: [
            'music_title',
            'artist',
            'album',
            'thumbnail',
            'spotify_id',
          ],
        },
      ],
    });

    if (!post) {
      return res
        .status(400)
        .send(responseUtil('ERROR', '게시글을 찾을 수 없습니다.', null));
    }

    console.log('내 게시물의 찾은 내용 백앤드::', post);
    res.status(200).send(
      responseUtil('SUCCESS', '게시글 조회 성공', {
        // post_id: post.post_id,
        title: post.title,
        content: post.content,
        post_image: post.post_image,
        tags: post.tags,
        music: {
          music_title: post.music.music_title,
          artist: post.music.artist,
          album: post.music.album,
          music_image: post.music.thumbnail,
          track_id: post.music.spotify_id,
          preview_url: post.music.spotify_preview_url,
        },
      }),
    );
  } catch (err) {
    console.error('게시글 조회 실패:', err);
    res.status(500).json({
      message: '서버 오류로 게시글을 불러오지 못했습니다.',
      data: null,
    });
  }
};

// controller/patchMood.js 또는 controllers/moodPostController.js 내
exports.patchMood = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res
      .status(401)
      .send(responseUtil('ERROR', '로그인 상태가 아닙니다.', null));
  }

  const sessionUser = req.session.passport.user.user_id;
  const { post_id } = req.params;

  try {
    // 기존 게시글 확인
    const existingPost = await Post.findOne({
      where: { post_id, user_id: sessionUser },
    });

    if (!existingPost) {
      return res
        .status(404)
        .send(responseUtil('ERROR', '해당 게시글을 찾을 수 없습니다.', null));
    }

    // 필드 추출 및 파싱
    const { title, content, tags } = req.body;
    const musicData = JSON.parse(req.body.music);
    const tagList = JSON.parse(tags);

    if (!title || !musicData) {
      return res
        .status(400)
        .send(responseUtil('ERROR', '제목과 음악 선택은 필수입니다.', null));
    }

    // 음악 존재 여부 확인 또는 새로 생성
    let music = await Music.findOne({
      where: { spotify_id: musicData.spotify_id },
    });

    if (!music) {
      music = await Music.create({
        music_title: musicData.title,
        artist: musicData.artist,
        album: musicData.album,
        thumbnail: musicData.thumbnail,
        spotify_id: musicData.spotify_id,
        spotify_preview_url: musicData.spotify_preview_url,
        created_at: new Date(),
      });
    }

    // 이미지 처리
    let updatedImagePath = existingPost.post_image;
    if (req.file) {
      updatedImagePath = `/uploads/${req.file.filename}`;
    }

    // 태그 문자열로 변환
    const tagsString = Array.isArray(tagList) ? tagList.join(',') : tagList;

    // 게시글 업데이트
    await existingPost.update({
      title,
      content,
      tags: tagsString,
      post_image: updatedImagePath,
      music_id: music.music_id,
      updated_at: new Date(),
    });

    // 성공 응답
    return res.status(200).send(
      responseUtil('SUCCESS', '게시글이 성공적으로 수정되었습니다.', {
        postId: existingPost.post_id,
        title: existingPost.title,
        post_image: updatedImagePath,
        music: {
          title: music.music_title,
          artist: music.artist,
        },
      }),
    );
  } catch (error) {
    console.error('게시글 수정 오류:', error);
    return res
      .status(500)
      .send(responseUtil('ERROR', '서버 오류가 발생했습니다.', null));
  }
};

exports.softDeleteMood = (req, res) => {};

exports.hardDeleteMood = (req, res) => {};

exports.patchRestoreMood = (req, res) => {};

// [GET] 내가 좋아요한 게시글
exports.getMyLikedMood = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res
      .status(401)
      .send(responseUtil('ERROR', '로그인 상태가 아닙니다.', null));
  }

  try {
    const sessionUser = req.session.passport.user.user_id;

    const likedPosts = await PostLike.findAll({
      where: {
        user_id: sessionUser,
        status: 'active',
      },
      include: [
        {
          model: Post,
          as: 'post', // ✅ 모델 관계에서 지정한 alias 사용
          attributes: ['post_id', 'title', 'post_image', 'tags'],
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['user_id', 'nickname', 'profile_image'],
            },
          ],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    const result = likedPosts.map(entry => entry.post).filter(Boolean);
    console.log('like의 백앤드 result::', result);

    return res
      .status(200)
      .send(responseUtil('SUCCESS', '좋아요한 게시글 조회 성공', result));
  } catch (error) {
    console.error('좋아요한 게시글 조회 오류:', error);
    return res
      .status(500)
      .send(responseUtil('ERROR', '좋아요 게시글 조회 서버 오류', null));
  }
};

// [GET] 내가 북마크한 게시글
exports.getMyMarkedMood = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res
      .status(401)
      .send(responseUtil('ERROR', '로그인 상태가 아닙니다.', null));
  }

  try {
    const sessionUser = req.session.passport.user.user_id;

    const markedPosts = await Bookmark.findAll({
      where: {
        user_id: sessionUser,
        status: 'active',
      },
      include: [
        {
          model: Post,
          as: 'post', // ✅ Bookmark와 연결된 Post의 alias
          attributes: ['post_id', 'title', 'post_image', 'tags'],
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['user_id', 'nickname', 'profile_image'],
            },
          ],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    console.log('marks 백앤드 result::', markedPosts);
    const result = markedPosts.map(entry => entry.post).filter(Boolean);
    console.log('marks 백앤드 result::', result);
    return res
      .status(200)
      .send(responseUtil('SUCCESS', '북마크한 게시글 조회 성공', result));
  } catch (error) {
    console.error('북마크한 게시글 조회 오류:', error);
    return res
      .status(500)
      .send(responseUtil('ERROR', '북마크 게시글 조회 서버 오류', null));
  }
};
