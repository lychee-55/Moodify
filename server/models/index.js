'use strict';

// const fs = require('fs');
// const path = require('path');
// const basename = path.basename(__filename);
const Sequelize = require('sequelize');
const process = require('process');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
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
db.UserModel = require('./User')(sequelize, Sequelize.DataTypes);
db.PostModel = require('./Posts')(sequelize, Sequelize.DataTypes);
db.PostLikeModel = require('./PostLike')(sequelize, Sequelize.DataTypes);
db.BookmarkModel = require('./Bookmark')(sequelize, Sequelize.DataTypes);
db.CommentModel = require('./Comment')(sequelize, Sequelize.DataTypes);

// (3) 모델간 관계 설정
// 🌟 1. User(사용자) - Post(게시글) : 1:N 관계
db.UserModel.hasMany(db.PostModel, {
  foreignKey: 'user_id',
  as: 'posts',
  onDelete: 'CASCADE',
});
db.PostModel.belongsTo(db.UserModel, {
  foreignKey: 'user_id',
  as: 'author',
});

// 🌟 2. User - PostLike 관계 (M:N through PostLikeModel)
db.UserModel.belongsToMany(db.PostModel, {
  through: db.PostLikeModel,
  as: 'likedPosts',
  foreignKey: 'user_id',
  otherKey: 'post_id',
  onDelete: 'CASCADE',
});
db.PostModel.belongsToMany(db.UserModel, {
  through: db.PostLikeModel,
  as: 'likedByUsers',
  foreignKey: 'post_id',
  otherKey: 'user_id',
  onDelete: 'CASCADE',
});

// 🌟 3. User - Bookmark 관계 (M:N through BookmarkModel)
db.UserModel.belongsToMany(db.PostModel, {
  through: db.BookmarkModel,
  as: 'bookmarkedPosts',
  foreignKey: 'user_id',
  otherKey: 'post_id',
  onDelete: 'CASCADE',
});
db.PostModel.belongsToMany(db.UserModel, {
  through: db.BookmarkModel,
  as: 'bookmarkedByUsers',
  foreignKey: 'post_id',
  otherKey: 'user_id',
  onDelete: 'CASCADE',
});

// 🌟 4. User - Comment 관계 (1:N)
db.UserModel.hasMany(db.CommentModel, {
  foreignKey: 'user_id',
  as: 'comments',
  onDelete: 'CASCADE',
});
db.CommentModel.belongsTo(db.UserModel, {
  foreignKey: 'user_id',
  as: 'commenter',
});

// 🌟 5. Post - Comment 관계 (1:N)
db.PostModel.hasMany(db.CommentModel, {
  foreignKey: 'post_id',
  as: 'postComments',
  onDelete: 'CASCADE',
});
db.CommentModel.belongsTo(db.PostModel, {
  foreignKey: 'post_id',
  as: 'post',
});

// 🌟 6. Post - PostLike 관계 (1:N)
db.PostModel.hasMany(db.PostLikeModel, {
  foreignKey: 'post_id',
  as: 'postLikes',
  onDelete: 'CASCADE',
});
db.PostLikeModel.belongsTo(db.PostModel, {
  foreignKey: 'post_id',
  as: 'post',
});

// 🌟 7. User - PostLike 관계 (1:N)
db.UserModel.hasMany(db.PostLikeModel, {
  foreignKey: 'user_id',
  as: 'givenLikes',
  onDelete: 'CASCADE',
});
db.PostLikeModel.belongsTo(db.UserModel, {
  foreignKey: 'user_id',
  as: 'user',
});

// 🌟 8. Post - Bookmark 관계 (1:N)
db.PostModel.hasMany(db.BookmarkModel, {
  foreignKey: 'post_id',
  as: 'postBookmarks',
  onDelete: 'CASCADE',
});
db.BookmarkModel.belongsTo(db.PostModel, {
  foreignKey: 'post_id',
  as: 'post',
});

// 🌟 9. User - Bookmark 관계 (1:N)
db.UserModel.hasMany(db.BookmarkModel, {
  foreignKey: 'user_id',
  as: 'myBookmarks',
  onDelete: 'CASCADE',
});
db.BookmarkModel.belongsTo(db.UserModel, {
  foreignKey: 'user_id',
  as: 'user',
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
