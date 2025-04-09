require('dotenv').config();
const express = require('express');
const db = require('./models');
const env = 'development';
const cors = require('cors');
const config = require('./config/config.json')[env];
const session = require('express-session');
const passport = require('./config/passport');
const path = require('path');
// require('./passport/kakaoStrategy');
// 카카오 로그인 전략 불러오기 (여기서 호출해야 함!)

const app = express();
const PORT = 8080;

// 미들웨어 처리
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // 정적 파일 처리

// 1. CORS 설정 (프론트엔드 localhost:3000 허용)
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true, // 쿠키 전송 허용
  }),
);

// 2. 세션 설정 (1시간 후 만료)
app.use(
  session({
    secret: config.sessionSecret, // 안전한 시크릿 키로 변경해야 함
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // 개발 환경에서는 false, 프로덕션에서는 true로 변경
      httpOnly: true,
      maxAge: 60 * 60 * 1000, // 1시간 (밀리초 단위)
      // sameSite: 'lax',
    },
    // store: 나중에 Redis 등으로 교체 가능 (현재는 메모리 저장)
  }),
);

// Passport 초기화
app.use(passport.initialize());
app.use(passport.session());

// router설정
app.get('/', (req, res) => {
  res.json({ msg: 'Index' });
});

const userRouter = require('./routes/user');
const moodRouter = require('./routes/moodPosts');
const likeNmarkRouter = require('./routes/likeNmark');
const myPageRouter = require('./routes/myPage');
app.use('/li/user', userRouter);
app.use('/li/moodPosts', moodRouter);
app.use('/li/moodPost/favor', likeNmarkRouter);
app.use('/li/moodPost/myPage', myPageRouter);

db.sequelize
  .sync({ force: false })
  .then(() => {
    console.log('DB connected!');
    // console.log('✅ Sequelize 모델 목록:', db.sequelize.models);

    app.listen(PORT, () => {
      console.log(`Server running on port http://localhost:${PORT}`);
      // console.log(`Current environment: ${process.env.NODE_ENV}`);
    });
  })
  .catch(err => {
    console.log('db connection error!');
    console.log(err);
  });
