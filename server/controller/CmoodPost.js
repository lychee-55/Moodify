// -- Active: 1732688863205@@127.0.0.1@3306@moodify
const db = require('../models');
const express = require('express');
const axios = require('axios');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const youtubeConfig = config.youtube;
// const Post = db.Post;
// const Music = db.Music;
// const User = db.User;
const { Post, Music, User, PostLike, Bookmark } = db;
const getAccessToken = require('../config/spotifyAPI');
const getYouTubeVideoId = require('../config/youtubeAPI');

const responseUtil = require('../utils/responseUtil');
const upload = require('../middlewares/uploads');
const { Op } = require('sequelize');

exports.searchMusic = async (req, res) => {
  const { q: query, page = 1 } = req.query;

  if (!query) {
    return res
      .status(400)
      .json(responseUtil('ERROR', '검색어가 필요합니다.', null));
  }

  try {
    const token = await getAccessToken();
    const limit = 5;
    const offset = (page - 1) * limit;

    const response = await axios.get('https://api.spotify.com/v1/search', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: query,
        type: 'track',
        limit,
        offset,
      },
    });

    const tracks = response.data.tracks.items.map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artists.map(a => a.name).join(', '),
      preview_url: track.preview_url,
      image: track.album.images[0]?.url,
      album: track.album.name,
    }));

    res.json(responseUtil('SUCCESS', '음악 검색 성공', tracks));
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json(responseUtil('ERROR', '서버 오류가 발생했습니다.', null));
  }
};

// 음악 제목과 아티스트로 YouTube 영상 ID 검색
exports.searchYouTubeAudio = async (req, res) => {
  console.log('🎵 컨트롤러 진입'); // 무조건 출력되게 분리
  console.log('📦 쿼리:', req.query);
  if (!req.isAuthenticated()) {
    return res
      .status(401)
      .send(responseUtil('ERROR', '로그인 상태가 아닙니다.', null));
  }

  // console.log('🎵 컨트롤러 진입: ', req.query);
  const { title, artist, post_id } = req.query;

  const query = `${title} ${artist} audio`; // 예: 'Shape of You Ed Sheeran audio'
  const apiKey = youtubeConfig.my_api_key;

  try {
    // const response = await axios.get(
    //   'https://www.googleapis.com/youtube/v3/search',
    //   {
    //     params: {
    //       q: query,
    //       part: 'snippet',
    //       maxResults: 1,
    //       key: apiKey,
    //       type: 'video',
    //     },
    //   },
    // );
    // https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=48&key=[YOUR_API_KEY]를
    const response = await axios.get(
      'https://www.googleapis.com/youtube/v3/search',
      {
        params: {
          part: 'snippet',
          maxResults: 5,
          key: youtubeConfig.my_api_key,
          q: `${title} ${artist} audio`,
          type: 'video',
        },
      },
    );

    const videoId = response.data.items[0]?.id.videoId;
    if (!videoId)
      return res
        .status(400)
        .send(responseUtil('ERROR', '음원을 찾을 수 없습니다.', null));

    res
      .status(200)
      .send(responseUtil('SUCCESS', '음원찾기에 성공했습니다.', videoId));
  } catch (err) {
    console.error('YouTube 검색 오류:', err);
    console.error(
      '❌ YouTube API 요청 실패:',
      error.response?.data || error.message,
    );
    res
      .status(500)
      .send(
        responseUtil('ERROR', '검색 오류: 음원 검색에 실패했습니다.', null),
      );
  }
};

exports.postCreateMood = async (req, res) => {
  // 0. 통합 세션 확인 (가장 먼저 처리)
  if (!req.isAuthenticated()) {
    return res
      .status(401)
      .send(responseUtil('ERROR', '로그인 상태가 아닙니다.', null));
  }
  const sessionUser = req.session.passport.user.user_id;

  console.log('=======================');
  console.log('백앤드의 파일 req.file::', req.file);
  console.log('백앤드의 파일 req.body::', req.body);
  console.log('=======================');
  try {
    // 2. 필수 필드 검증
    const { title, content, tags } = req.body;
    // 3. 음악 데이터 파싱
    const musicData = JSON.parse(req.body.music);
    const tagList = JSON.parse(tags);

    if (!title || !musicData) {
      return res
        .status(400)
        .send(
          responseUtil('ERROR', '제목과 음악 선택은 필수 항목입니다.', null),
        );
    }

    // 4. 음악 데이터 처리
    let music = await Music.findOne({
      where: { spotify_id: musicData.spotify_id },
    });

    if (!music) {
      music = await Music.create({
        music_title: musicData.title,
        artist: musicData.artist,
        album: musicData.album,
        // duration_ms: musicData.duration_ms,
        thumbnail: musicData.thumbnail,
        spotify_id: musicData.spotify_id,
        spotify_preview_url: musicData.spotify_preview_url,
        created_at: new Date(),
      });
    }

    // 5. 이미지 처리
    let imagePath = null;
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`; // 이미 multer가 저장한 파일명 사용
    }

    // tags가 배열인 경우, 쉼표로 구분된 문자열로 변환
    const tagsString = Array.isArray(tagList) ? tagList.join(',') : tagList;

    // 6. 게시글 생성
    const newPost = await Post.create({
      title: title,
      content: content || null,
      post_image: imagePath,
      music_id: music.music_id,
      tags: tagsString,
      created_at: new Date(),
      user_id: sessionUser,
    });

    // 7. 성공 응답
    return res.status(201).send(
      responseUtil('SUCCESS', '게시글이 성공적으로 생성되었습니다.', {
        postId: newPost.post_id,
        title: newPost.title,
        post_image: imagePath,
        music: {
          title: music.music_title,
          artist: music.artist,
        },
      }),
    );
  } catch (error) {
    console.error('게시글 생성 오류:', error);
    return res
      .status(500)
      .send(responseUtil('ERROR', '서버 처리 중 오류가 발생했습니다.', null));
  }
};

exports.getAllMoodList = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // 기본값 1
  const limit = parseInt(req.query.limit) || 10; // 기본값 10
  const offset = (page - 1) * limit;

  try {
    const posts = await Post.findAll({
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
      .send(responseUtil('SUCCESS', '전체 게시글 조회 성공', formattedPosts));
  } catch (error) {
    console.error('게시글 조회 오류:', error);
    return res
      .status(500)
      .send(responseUtil('ERROR', '전체 조회 서버 오류', null));
  }
};

// router.get('/view/:post_id', controller.getOneMoodPost);
exports.getOneMoodPost = async (req, res) => {
  // 0. 통합 세션 확인 (가장 먼저 처리)
  if (!req.isAuthenticated()) {
    return res
      .status(401)
      .send(responseUtil('ERROR', '로그인 상태가 아닙니다.', null));
  }

  try {
    const sessionUser = req.session.passport.user.user_id;
    const { post_id } = req.params;

    const post = await Post.findOne({
      where: { post_id: post_id },
      include: [
        {
          model: Music,
          as: 'music', // 반드시 alias 명시
          attributes: [
            'music_title',
            'artist',
            'thumbnail',
            // 'spofity_preview_url',
          ],
        },
        {
          model: User,
          as: 'author', // 반드시 alias 명시
          attributes: ['nickname', 'profile_image'],
        },
      ],
    });

    console.log('getonepost:', post);
    if (!post) {
      return res
        .status(404)
        .send(responseUtil('ERROR', '게시글을 찾을 수 없습니다.', null));
    }

    // 좋아요 여부 확인
    const liked = await PostLike.findOne({
      where: {
        post_id: post.post_id,
        user_id: sessionUser,
        status: 'active', // 소프트삭제 방지용
      },
    });

    // 북마크 여부 확인
    const bookmarked = await Bookmark.findOne({
      where: {
        post_id: post.post_id,
        user_id: sessionUser,
        status: 'active',
      },
    });

    // 좋아요 개수
    // const likeCount = await PostLike.count({
    //   where: {
    //     post_id: post.post_id,
    //     status: 'active',
    //   },
    // });

    const responseData = {
      postId: post.post_id,
      imageUrl: post.post_image, // 게시글 이미지
      title: post.title,
      content: post.content,
      user: {
        nickname: post.author.nickname,
        profileImage: post.author.profile_image,
      },
      music: {
        title: post.music.music_title,
        artist: post.music.artist,
        coverImage: post.music.thumbnail,
        // audioUrl: post.Music.spofity_preview_url,
      },
      likes: post.likes_count || 0, // 좋아요 수
      isLiked: !!liked, // 로그인 세션 기반으로 처리 가능
      isBookmarked: !!bookmarked, // 로그인 세션 기반으로 처리 가능
    };

    return res
      .status(200)
      .send(responseUtil('SUCCESS', '게시글 상세 조회 성공', responseData));
  } catch (error) {
    console.error(error);
    return res.status(500).send(responseUtil('ERROR', '서버 오류', null));
  }
};

exports.getPopularMoods = (req, res) => {};

// 게시글 검색 조회
// router.get('/search', controller.getFilteredMood);
exports.getFilteredMood = async (req, res) => {
  const keyword = req.query.keyword;
  console.log('getfilterpost::', keyword);

  if (!keyword) {
    return res
      .status(400)
      .send(responseUtil('ERROR', '검색어를 입력해주세요.', null));
  }
  // const page = parseInt(req.query.page) || 1;
  // const limit = parseInt(req.query.limit) || 10;
  // const offset = (page - 1) * limit;

  try {
    const results = await Post.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${keyword}%` } },
          { content: { [Op.like]: `%${keyword}%` } },
          { tags: { [Op.like]: `%${keyword}%` } },
          // { location: { [Op.like]: `%${keyword}%` } },
        ],
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['user_id', 'nickname', 'profile_image'],
        },
        {
          model: Music,
          as: 'music',
          attributes: ['music_id', 'music_title', 'artist', 'thumbnail'],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    const formattedPosts = results.map(post => ({
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
    console.log('search data::', formattedPosts);

    return res
      .status(200)
      .send(responseUtil('SUCCESS', '검색 게시글 조회 성공', formattedPosts));
  } catch (error) {
    console.error('검색 오류:', error);
    return res
      .status(500)
      .send(responseUtil('ERROR', '검색 중 서버 오류', null));
  }
};
