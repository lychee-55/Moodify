const { Op } = require('sequelize'); // 이 줄을 추가
const db = require('../models');
const express = require('express');
const bcrypt = require('bcrypt');
const axios = require('axios');
const User = db.UserModel;
const passport = require('passport');
const responseUtil = require('../utils/ResponseUtil');
const env = 'development';
const config = require(__dirname + '/../config/config.json')[env];
const kakaoConfig = config.kakao;

exports.getTest = (req, res) => {
  res.send({ message: 'test' });
};

exports.PostSignup = async (req, res) => {
  try {
    const { email, password, nickname } = req.body;

    // 4. 탈퇴한 계정 확인
    const deletedUser = await User.findOne({
      where: {
        email,
        deleted_at: { [Op.ne]: null }, // deleted_at이 null이 아닌 경우
      },
    });

    if (deletedUser) {
      return res
        .status(400)
        .send(
          responseUtil(
            'ERROR',
            '탈퇴한 계정입니다. 복구를 원하시면 관리자에게 문의하세요.',
            null,
          ),
        );
    }

    // // 이메일 중복 확인
    // const existingUser = await User.findOne({ where: { email } });
    // if (existingUser) {
    //   return res
    //     .status(409)
    //     .send(responseUtil('ERROR', '이미 존재하는 이메일입니다.', null));
    // }

    // 2. 비밀번호 암호화
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 5. auth_provider 설정 및 사용자 생성
    const newUser = await User.create({
      email,
      password_hash: hashedPassword,
      nickname,
      auth_provider: 'email',
    });

    // 1. 성공 응답
    res
      .status(201)
      .send(responseUtil('SUCCESS', '회원가입이 완료되었습니다.', null));
  } catch (error) {
    console.error('회원가입 에러:', error);

    // 1. 서버 에러 응답
    res
      .status(500)
      .send(
        responseUtil(
          'ERROR',
          '서버에러가 생겼습니다. 관리자에게 문의하세요.',
          null,
        ),
      );
  }
};

exports.getCheckNickname = async (req, res) => {
  try {
    const { nickname } = req.query;

    const existNickname = await User.findOne({
      where: { nickname },
    });

    if (existNickname) {
      return res
        .status(200)
        .send(responseUtil('ERROR', '이미 사용 중인 닉네임입니다.', null));
    }

    return res
      .status(200)
      .send(responseUtil('SUCCESS', '사용 가능한 닉네임입니다.', null));
  } catch (error) {
    console.error('닉네임 중복 확인 오류:', error);
    return res
      .status(500)
      .send(
        responseUtil(
          'ERROR',
          '서버에러가 생겼습니다. 관리자에게 문의하세요.',
          null,
        ),
      );
  }
};

exports.getCheckEmail = async (req, res) => {
  try {
    const { email } = req.query;
    console.log('User model definition:', db.UserModel); // 모델 확인
    console.log(req.query);

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .send(responseUtil('ERROR', '유효한 이메일 형식이 아닙니다.', null));
    }

    const existEmail = await User.findOne({
      where: { email },
    });

    if (existEmail) {
      return res
        .status(200)
        .send(responseUtil('ERROR', '이미 사용 중인 이메일입니다.', null));
    }

    return res
      .status(200)
      .send(responseUtil('SUCCESS', '사용 가능한 이메일입니다.', null));
  } catch (error) {
    console.error('이메일 중복 확인 오류:', error);
    return res
      .status(500)
      .send(
        responseUtil(
          'ERROR',
          '서버에러가 생겼습니다. 관리자에게 문의하세요.',
          null,
        ),
      );
  }
};

exports.postLogin = (req, res, next) => {
  console.log('로그인 요청 데이터:', req.body); // 추가
  passport.authenticate('local', async (err, user, info) => {
    if (err) {
      console.error('로그인 에러:', err);
      return res
        .status(500)
        .send(responseUtil('ERROR', '서버 에러가 발생했습니다.', null));
    }

    // 인증 실패 시
    if (!user) {
      return res.status(400).send(responseUtil('ERROR', info.message, null));
    }

    // 로그인 성공
    req.login(user, loginErr => {
      if (loginErr) {
        console.error('세션 생성 에러:', loginErr);
        return res
          .status(500)
          .send(
            responseUtil('ERROR', '로그인 처리 중 오류가 발생했습니다.', null),
          );
      }

      // 로그인 성공 응답
      return res.status(200).send(
        responseUtil('SUCCESS', '로그인 성공', {
          user: {
            email: user.email,
            nickname: user.nickname,
            profile_image: user.profile_image,
            auth_provider: user.auth_provider,
          },
        }),
      );
    });
  })(req, res, next);
};

// 로그인 상태 확인
exports.getCheckAuth = (req, res) => {
  try {
    if (req.isAuthenticated()) {
      console.log('세션 유지 중:', req.user.user_id);

      return res.status(200).send(
        responseUtil('SUCCESS', '로그인 상태입니다.', {
          user: {
            email: req.user.email,
            nickname: req.user.nickname,
            profile_image: req.user.profile_image,
          },
        }),
      );
    }

    // 세션이 없는 경우 (401 Unauthorized)
    return res
      .status(401)
      .send(responseUtil('ERROR', '로그인이 필요합니다.', null));
  } catch (error) {
    console.error('세션 확인 중 서버 에러:', error);
    // 서버 오류 경우 (500 Internal Server Error)
    return res
      .status(500)
      .send(
        responseUtil(
          'ERROR',
          '서버 오류가 발생했습니다. 나중에 다시 시도해주세요.',
          null,
        ),
      );
  }
};

// 카카오 로그인
// GET /li/user/kakao-login
exports.getKakaoLogin = passport.authenticate('kakao');

// GET /li/user/kakao/callback
exports.getKakaoCallback = (req, res, next) => {
  passport.authenticate(
    'kakao',
    { failureRedirect: '/li/user/login' },
    (err, user) => {
      if (err) return next(err);
      if (!user) return res.redirect(`${kakaoConfig.clientUrl}/li/login`);

      req.login(user, loginErr => {
        if (loginErr) return next(loginErr);
        return res.redirect(`${kakaoConfig.clientUrl}`);
      });
    },
  )(req, res, next);
};

// 로그아웃
exports.postLogout = (req, res) => {
  try {
    req.logout(err => {
      if (err) {
        console.error('로그아웃 에러:', err);
        return res
          .status(500)
          .send(
            responseUtil(
              'ERROR',
              '로그아웃 처리 중 오류가 발생했습니다.',
              null,
            ),
          );
      }
      req.session.destroy(() => {
        res.clearCookie('connect.sid'); // 세션 쿠키 삭제
      });
      return res
        .status(200)
        .send(responseUtil('SUCCESS', '로그아웃 되었습니다.', null));
    });
  } catch (error) {
    console.error('일반 로그아웃 에러:', error);
    return res.status(500).json({ message: '일반반 로그아웃 실패' });
  }
};

exports.postKakaoLogout = async (req, res) => {
  try {
    const user = req.user;
    console.log('카카오 로그아웃:req.user', user);
    if (!user || !user.access_token) {
      return res.status(401).json({ message: '로그인 상태가 아닙니다.' });
    }

    // 🔹 1. 카카오 API 로그아웃 요청 (토큰 만료)
    await axios.post('https://kapi.kakao.com/v1/user/logout', null, {
      headers: { Authorization: `Bearer ${user.access_token}` },
    });

    // 🔹 2. 세션 및 토큰 삭제 (유저 정보는 유지)
    await user.update({ access_token: null, refresh_token: null });

    req.logout(err => {
      if (err) return res.status(500).json({ message: '로그아웃 실패' });

      req.session.destroy(() => {
        res.clearCookie('connect.sid'); // 세션 쿠키 삭제
        res.json({ message: '카카오 로그아웃 성공' });
      });
    });
  } catch (error) {
    console.error('카카오 로그아웃 에러:', error);
    return res.status(500).json({ message: '카카오 로그아웃 실패' });
  }
};

exports.getMyProfile = (req, res) => {};

exports.postMyProfile = (req, res) => {};

// 회원탈퇴
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.session?.passport?.user?.id;
    if (!userId) {
      return res.send(
        responseUtil('ERROR', '로그인된 사용자가 없습니다.', null),
      );
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.send(
        responseUtil('ERROR', '사용자를 찾을 수 없습니다.', null),
      );
    }

    // 🔹 카카오 로그인 사용자인 경우, 카카오 API에서 연결 해제
    if (user.auth_provider === 'kakao') {
      const accessToken = req.session?.passport?.user?.access_token;
      if (!accessToken) {
        return res.send(
          responseUtil('ERROR', '카카오 액세스 토큰이 없습니다.', null),
        );
      }

      await axios.post(
        'https://kapi.kakao.com/v1/user/unlink',
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
    }

    // 🔹 DB에서 사용자 삭제 (소프트 삭제 X)
    await user.destroy();

    // 🔹 세션 및 쿠키 삭제
    req.logout(err => {
      if (err)
        return res.send(responseUtil('ERROR', '로그아웃 중 오류 발생', null));

      req.session.destroy(sessionErr => {
        if (sessionErr)
          return res.send(
            responseUtil('ERROR', '세션 삭제 중 오류 발생', null),
          );

        res.clearCookie('connect.sid');
        return res.send(
          responseUtil('SUCCESS', '회원 탈퇴가 완료되었습니다.', null),
        );
      });
    });
  } catch (error) {
    console.error('회원 탈퇴 중 오류 발생:', error);
    return res.send(responseUtil('ERROR', '회원 탈퇴 중 오류 발생', null));
  }
};
