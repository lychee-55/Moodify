const { Op } = require('sequelize'); // 이 줄을 추가
const db = require('../models');
const express = require('express');
const bcrypt = require('bcrypt');
const axios = require('axios');
const User = db.User;
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
    const { email, password, nickname, profile_image } = req.body;

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

    // 2. 비밀번호 암호화
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 5. auth_provider 설정 및 사용자 생성
    const newUser = await User.create({
      email,
      password_hash: hashedPassword,
      nickname,
      auth_provider: 'email',
      profile_image,
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
    console.log('User model definition:', db.User); // 모델 확인
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
    console.log(req.session);
    console.log('getcheckauth::', req.session.passport);
    // if (req.session.passport) {
    //   const { auth_provider, nickname } = req.session.passport.user;
    //   return res.send(
    //     responseUtil('SUCCESS', '세션이 존재합니다.', {
    //       auth_provider,
    //       nickname,
    //     }),
    //   );
    // }
    if (req.isAuthenticated() && req.session.passport?.user) {
      const { auth_provider, nickname } = req.session.passport.user;
      return res.send(
        responseUtil('SUCCESS', '세션이 존재합니다.', {
          auth_provider,
          nickname,
        }),
      );
    }

    // 세션이 없는 경우 (401 Unauthorized)
    return res
      .status(401)
      .send(
        responseUtil(
          'ERROR',
          '세션이 만료되었습니다. \n 로그인이 필요합니다.',
          null,
        ),
      );
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
    console.log('req.session:', req.session); // 추가
    if (!req.session) {
      console.error('세션이 존재하지 않습니다.');
      return res
        .status(400)
        .send(responseUtil('ERROR', '세션이 존재하지 않습니다.', null));
    }

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
      req.session.destroy(err => {
        if (err) {
          console.error('세션 삭제 에러:', err);
          return res
            .status(500)
            .send(
              responseUtil('ERROR', '세션 삭제 중 오류가 발생했습니다.', null),
            );
        }

        res.clearCookie('connect.sid');
        return res
          .status(200)
          .send(responseUtil('SUCCESS', '로그아웃 되었습니다.', null));
      });
    });
  } catch (error) {
    console.error('일반 로그아웃 에러:', error);
    return res.status(500).json({ message: '일반 로그아웃 실패' });
  }
};

exports.postKakaoLogout = async (req, res) => {
  console.log('로그아웃 전 세션 확인', req.session);
  try {
    const sessionUser = req.session.passport.user.user_id;
    if (!req.session.passport || !req.session.passport.user) {
      return res.send(responseUtil('ERROR', '로그인 상태가 아닙니다.', null));
    }

    const accessToken = req.session.passport.user.access_token;

    if (!accessToken) {
      return res.send(
        responseUtil('ERROR', '액세스 토큰이 존재하지 않습니다.', null),
      );
    }

    const checkSessionUser = await User.findOne({
      where: { user_id: sessionUser },
      paranoid: false,
    });

    if (checkSessionUser) {
      // 1. 카카오 API에 로그아웃 요청
      await axios.post('https://kapi.kakao.com/v1/user/logout', null, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // 🔹 2. 세션 및 토큰 삭제 (유저 정보는 유지)
      await checkSessionUser.update({
        access_token: null,
        refresh_token: null,
      });
      console.log('Cuser의 로그아웃 업데이트된 유저 정보:', checkSessionUser);
      req.logout(err => {
        if (err) return res.status(500).json({ message: '로그아웃 실패' });

        req.session.destroy(err => {
          if (err) {
            console.error('세션 삭제 에러:', err);
            return res.status(500).json({ message: '세션 삭제 실패' });
          }

          res.clearCookie('connect.sid'); // 세션 쿠키 삭제
          return res.json({ message: '카카오 로그아웃 성공' });
        });
      });
    } else {
      return res.send(
        responseUtil('ERROR', '존재하지 않는 사용자 입니다.', null),
      );
    }
  } catch (error) {
    console.error('카카오 로그아웃 에러:', error);
    return res.status(500).json({ message: '카카오 로그아웃 실패' });
  }
};

//GET /li/user/profile
exports.getMyProfile = async (req, res) => {
  try {
    console.log('getmyprofile req.passport::', req.session.passport);
    console.log('전체 세션:', req.session);
    console.log('req.user:', req.user);
    if (!req.session.passport || !req.session.passport.user) {
      return res.send(responseUtil('ERROR', '로그인 상태가 아닙니다.', null));
    }
    const { user_id } = req.session.passport.user;

    const checkSessionUser = await User.findOne({
      where: { user_id: user_id },
      attributes: ['nickname', 'email', 'profile_image'],
      paranoid: false,
    });

    if (!checkSessionUser) {
      return res.send(
        responseUtil('ERROR', '사용자 정보를 찾을 수 없습니다.', null),
      );
    }

    const data = {
      nickname: checkSessionUser.nickname,
      email: checkSessionUser.email ?? 'kakao_email',
      profile_image: checkSessionUser.profile_image ?? 'default_image', // 닉네임 기반 seed
      // profile_image가 null이면 'default_image'로 대체
    };

    return res.send(responseUtil('SUCCESS', '프로필 조회 성공', data));
  } catch (error) {
    console.error('프로필 불러오기 에러: ', error);
    return res.status(500).json({ message: '프로필 불러오기 실패' });
  }
};

//router.put('/profile', controller.putMyProfile);
exports.putMyProfile = async (req, res) => {
  try {
    // 1. 인증 확인
    if (!req.session.passport?.user) {
      return res.send(responseUtil('ERROR', '로그인 상태가 아닙니다.'));
    }

    const { user_id } = req.session.passport.user;
    const { nickname, profile_image, newPassword } = req.body;

    // 2. 업데이트 데이터 준비
    const updateData = {};
    if (nickname) updateData.nickname = nickname;
    if (profile_image) updateData.profile_image = profile_image;

    // 3. 비밀번호 변경 처리
    if (newPassword) {
      // 새 비밀번호 해싱
      const saltRounds = 10;
      updateData.password_hash = await bcrypt.hash(newPassword, saltRounds);
    }

    // 4. 실제 업데이트 실행
    const [affectedRows] = await User.update(updateData, {
      where: { user_id },
    });

    if (affectedRows === 0) {
      return res.send(responseUtil('ERROR', '프로필 업데이트에 실패했습니다.'));
    }

    // 5. 업데이트된 사용자 정보 반환
    const updatedUser = await User.findOne({
      where: { user_id },
      attributes: ['user_id', 'nickname', 'email', 'profile_image'],
      raw: true,
    });

    return res.send(
      responseUtil(
        'SUCCESS',
        '프로필이 성공적으로 업데이트되었습니다.',
        updatedUser,
      ),
    );
  } catch (error) {
    console.error('프로필 업데이트 오류:', error);
    return res.send(responseUtil('ERROR', '서버 오류가 발생했습니다.'));
  }
};

// router.get('/profile/check-password', controller.getCheckPassword);
// 비밀번호 확인 API
exports.postCheckPassword = async (req, res) => {
  try {
    if (!req.session.passport?.user) {
      return res.send(responseUtil('ERROR', '로그인 상태가 아닙니다.'));
    }

    const { user_id } = req.session.passport.user;
    const { password } = req.body; // POST 요청에서 비밀번호 추출

    if (!password) {
      return res.send(responseUtil('ERROR', '비밀번호를 입력해주세요.'));
    }

    const user = await User.findOne({
      where: { user_id },
      attributes: ['user_id', 'password_hash'], // 명시적으로 필요한 필드만 선택
      raw: true,
    });

    if (!user || !user.password_hash) {
      return res.send(responseUtil('ERROR', '사용자 정보를 찾을 수 없습니다.'));
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    return res.send(
      responseUtil(
        isMatch ? 'SUCCESS' : 'ERROR',
        isMatch ? '비밀번호 확인 성공' : '비밀번호가 일치하지 않습니다.',
      ),
    );
  } catch (error) {
    console.error('비밀번호 확인 오류:', error);
    return res.send(responseUtil('ERROR', '서버 오류가 발생했습니다.'));
  }
};

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
