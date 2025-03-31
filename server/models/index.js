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

// (3) 모델간 관계 설정

// (4) db객체에 모델 추가

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
