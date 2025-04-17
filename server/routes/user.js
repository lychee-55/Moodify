const express = require('express');
const router = express.Router();
const controller = require('../controller/Cuser');

router.get('/test', controller.getTest);
// 회원가입
router.post('/sign-up', controller.PostSignup);

// 중복체크
router.get('/check-nickname', controller.getCheckNickname);

router.get('/check-email', controller.getCheckEmail);

// 로그인
router.post('/login', controller.postLogin);

router.get('/kakao-login', controller.getKakaoLogin);

router.get('/kakao/callback', controller.getKakaoCallback);

// 세션확인
router.get('/check-session', controller.getCheckAuth);

// 로그아웃
router.post('/logout', controller.postLogout);

router.post('/kakao-logout', controller.postKakaoLogout);

// 사용자 프로필
router.get('/profile', controller.getMyProfile);

router.post('/profile/check-password', controller.postCheckPassword);

router.put('/profile', controller.putMyProfile);

router.post('/find-password', controller.resetPassword);

//회원탈퇴
router.post('/delete', controller.deleteUser);

module.exports = router;
