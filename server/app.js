const express = require('express');
const db = require('./models');
const app = express();
const PORT = 8080;

// 미들웨어 처리
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// router설정
app.get('/', (req, res) => {
  res.json({ msg: 'Index' });
});

const userRouter = require('./routes/user');
const moodRouter = require('./routes/moodPosts');
app.use('/li/user', userRouter);
app.use('/li/moodPost', moodRouter);

db.sequelize
  .sync({ force: false })
  .then(() => {
    console.log('DB connected!');

    app.listen(PORT, () => {
      console.log(`Server running on port http://localhost:${PORT}`);
      console.log(`Current environment: ${process.env.NODE_ENV}`);
    });
  })
  .catch(err => {
    console.log('db connection error!');
    console.log(err);
  });
