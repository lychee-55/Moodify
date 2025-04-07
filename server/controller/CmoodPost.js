// -- Active: 1732688863205@@127.0.0.1@3306@moodify
const db = require('../models');
const express = require('express');
const axios = require('axios');
const Posts = require('../models/Posts');
const PostLikes = require('../models/PostLike');
const Bookmarks = require('../models/Bookmark');
const getAccessToken = require('../config/spotifyAPI');
const getYouTubeVideoId = require('../config/youtubeAPI');

const responseUtil = require('../utils/responseUtil');

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
exports.searchMusicVideo = async (req, res) => {
  const { keyword } = req.query; // 프론트에서 "제목 아티스트"로 넘김
  try {
    const videoId = await getYouTubeVideoId(keyword);
    if (videoId) {
      return res.json({ videoId });
    } else {
      return res.status(404).json({ message: 'No video found' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'YouTube search failed' });
  }
};

exports.postCreateMood = (req, res) => {};

exports.patchMood = (req, res) => {};

exports.softDeleteMood = (req, res) => {};

exports.hardDeleteMood = (req, res) => {};

exports.patchRestoreMood = (req, res) => {};

exports.getAllMoodList = (req, res) => {};

exports.getOneMoodList = (req, res) => {};

exports.getPopularMoods = (req, res) => {};

exports.getFilteredMood = (req, res) => {};
