const db = require('../models');
const express = require('express');
const bcrypt = require('bcrypt');
const axios = require('axios');
const User = require('../models/User');

exports.PostSignup = (req, res) => {};

exports.getCheckNickname = (req, res) => {
  res.send('dusrufrhls');
};

exports.getCheckEmail = (req, res) => {};

exports.postLogin = (req, res) => {};

exports.postKakaoLogin = (req, res) => {};

exports.postLogout = (req, res) => {};

exports.postKakaoLogout = (req, res) => {};

exports.getMyProfile = (req, res) => {};

exports.postMyProfile = (req, res) => {};

exports.deleteMyProfile = (req, res) => {};
