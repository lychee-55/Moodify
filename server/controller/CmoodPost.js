// -- Active: 1732688863205@@127.0.0.1@3306@moodify
const db = require('../models');
const express = require('express');
const axios = require('axios');
const Posts = require('../models/Posts');
const PostLikes = require('../models/PostLike');
const Bookmarks = require('../models/Bookmark');

exports.postCreateMood = (req, res) => {};

exports.patchMood = (req, res) => {};

exports.softDeleteMood = (req, res) => {};

exports.hardDeleteMood = (req, res) => {};

exports.patchRestoreMood = (req, res) => {};

exports.getAllMoodList = (req, res) => {};

exports.getOneMoodList = (req, res) => {};

exports.getPopularMoods = (req, res) => {};

exports.getFilteredMood = (req, res) => {};
