const express = require('express');
const router = express.Router();
const controller = require('../controller/Cuser');

// 회원가입
router.post('/sign-up', controller.PostSignup);

router.get('/check-nickname', controller.getCheckNickname);

router.get('/check-email', controller.getCheckEmail);

// 로그인
router.post('/login', controller.postLogin);

router.post('/kakao-login', controller.postKakaoLogin);

// 로그아웃
router.post('/logout', controller.postLogout);

router.post('/kakao-logout', controller.postKakaoLogout);

// 사용자 프로필
router.get('/profile', controller.getMyProfile);

router.post('/profile', controller.postMyProfile);

//회원탈퇴
router.post('/delete', controller.deleteMyProfile);

module.exports = router;
