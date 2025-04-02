const { Op } = require('sequelize'); // 이 줄을 추가
const db = require('../models');
const express = require('express');
const bcrypt = require('bcrypt');
const axios = require('axios');
const User = db.UserModel;
const responseUtil = require('../utils/ResponseUtil');

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
  passport.authenticate('local', (err, user, info) => {
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
          },
        }),
      );
    });
  })(req, res, next);
};

// 로그인 상태 확인
exports.getCheckAuth = (req, res) => {
  if (req.isAuthenticated()) {
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

  return res
    .status(401)
    .send(responseUtil('ERROR', '로그인이 필요합니다.', null));
};

// 로그아웃

exports.postKakaoLogin = (req, res) => {};

exports.postLogout = (req, res) => {
  req.logout();
  req.session.destroy();
  return res
    .status(200)
    .send(responseUtil('SUCCESS', '로그아웃 되었습니다.', null));
};

exports.postKakaoLogout = (req, res) => {};

exports.getMyProfile = (req, res) => {};

exports.postMyProfile = (req, res) => {};

exports.deleteMyProfile = (req, res) => {};
