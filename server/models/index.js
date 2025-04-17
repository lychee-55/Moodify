'use strict';

// const fs = require('fs');
// const path = require('path');
// const basename = path.basename(__filename);
const Sequelize = require('sequelize');
// const process = require('process');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const db = {};

// (1) Sequelize 클래스를 통해서 sequelize 객체를 생성
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
);

// (2) 모델을 불러오면서 인자로 정보 전달
// (4) db객체에 모델 추가
db.User = require('./User')(sequelize, Sequelize.DataTypes);
db.Post = require('./Posts')(sequelize, Sequelize.DataTypes);
db.PostLike = require('./PostLike')(sequelize, Sequelize.DataTypes);
db.Bookmark = require('./Bookmark')(sequelize, Sequelize.DataTypes);
db.Comment = require('./Comment')(sequelize, Sequelize.DataTypes);
db.Music = require('./Music')(sequelize, Sequelize.DataTypes);

// console.log('✅ User 모델 확인:', db.User);
// console.log('✅ sequelize.models:', sequelize.models);
// console.log(
//   '✅ User 모델의 클래스 확인 db.User instanceof Sequelize.Model:',
//   db.User instanceof Sequelize.Model,
// );

// fs.readdirSync(__dirname)
//   .filter(file => file !== 'index.js' && file.endsWith('.js'))
//   .forEach(file => {
//     const model = require(path.join(__dirname, file))(
//       sequelize,
//       Sequelize.DataTypes,
//     );
//     db[model.name] = model;
//   });

// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// (3) 모델간 관계 설정
// 🌟 1. User(사용자) - Post(게시글) : 1:N 관계
db.User.hasMany(db.Post, {
  foreignKey: 'user_id',
  as: 'posts',
  onDelete: 'CASCADE',
});
db.Post.belongsTo(db.User, {
  foreignKey: 'user_id',
  as: 'author',
});

// 🌟 2. Post(게시글) - Music(음악) : 1:1 관계 (NEW)
db.Post.belongsTo(db.Music, {
  foreignKey: 'music_id', // Post 모델의 외래키
  as: 'music', // 접근 시 사용할 별칭 (post.getMusic())
  onDelete: 'SET NULL', // 음악 삭제 시 게시글은 유지
});

db.Music.hasOne(db.Post, {
  foreignKey: 'music_id',
  as: 'post', // 접근 시 사용할 별칭 (music.getPost())
});

// 🌟 2. User - PostLike 관계 (M:N through PostLike)
db.User.belongsToMany(db.Post, {
  through: db.PostLike,
  as: 'likedPosts',
  foreignKey: 'user_id',
  otherKey: 'post_id',
  onDelete: 'CASCADE',
});
db.Post.belongsToMany(db.User, {
  through: db.PostLike,
  as: 'likedByUsers',
  foreignKey: 'post_id',
  otherKey: 'user_id',
  onDelete: 'CASCADE',
});

// 🌟 3. User - Bookmark 관계 (M:N through Bookmark)
db.User.belongsToMany(db.Post, {
  through: db.Bookmark,
  as: 'bookmarkedPosts',
  foreignKey: 'user_id',
  otherKey: 'post_id',
  onDelete: 'CASCADE',
});
db.Post.belongsToMany(db.User, {
  through: db.Bookmark,
  as: 'bookmarkedByUsers',
  foreignKey: 'post_id',
  otherKey: 'user_id',
  onDelete: 'CASCADE',
});

// 🌟 4. User - Comment 관계 (1:N)
db.User.hasMany(db.Comment, {
  foreignKey: 'user_id',
  as: 'comments',
  onDelete: 'CASCADE',
});
db.Comment.belongsTo(db.User, {
  foreignKey: 'user_id',
  as: 'commenter',
});

// 🌟 5. Post - Comment 관계 (1:N)
db.Post.hasMany(db.Comment, {
  foreignKey: 'post_id',
  as: 'postComments',
  onDelete: 'CASCADE',
});
db.Comment.belongsTo(db.Post, {
  foreignKey: 'post_id',
  as: 'post',
});

// 🌟 6. Post - PostLike 관계 (1:N)
db.Post.hasMany(db.PostLike, {
  foreignKey: 'post_id',
  as: 'postLikes',
  onDelete: 'CASCADE',
});
db.PostLike.belongsTo(db.Post, {
  foreignKey: 'post_id',
  as: 'post',
});

// 🌟 7. User - PostLike 관계 (1:N)
db.User.hasMany(db.PostLike, {
  foreignKey: 'user_id',
  as: 'givenLikes',
  onDelete: 'CASCADE',
});
db.PostLike.belongsTo(db.User, {
  foreignKey: 'user_id',
  as: 'user',
});

// 🌟 8. Post - Bookmark 관계 (1:N)
db.Post.hasMany(db.Bookmark, {
  foreignKey: 'post_id',
  as: 'postBookmarks',
  onDelete: 'CASCADE',
});
db.Bookmark.belongsTo(db.Post, {
  foreignKey: 'post_id',
  as: 'post',
});

// 🌟 9. User - Bookmark 관계 (1:N)
db.User.hasMany(db.Bookmark, {
  foreignKey: 'user_id',
  as: 'myBookmarks',
  onDelete: 'CASCADE',
});
db.Bookmark.belongsTo(db.User, {
  foreignKey: 'user_id',
  as: 'user',
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
