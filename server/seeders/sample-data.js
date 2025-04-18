'use strict';

const { faker } = require('@faker-js/faker');
const axios = require('axios');
const db = require('../models');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const { Post, Music, User, PostLike, Bookmark } = db;
const getAccessToken = require('../config/spotifyAPI');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // 1. 유저 30명 생성
      const users = [];
      for (let i = 0; i < 30; i++) {
        users.push({
          email: faker.internet.email(),
          nickname: faker.internet.username(),
          password_hash: faker.internet.password(),
          auth_provider: 'email',
          profile_image: faker.image.avatar(),
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
      await queryInterface.bulkInsert('users', users, {});
      console.log('✅ Users inserted successfully.');

      // 2. 유저 ID 목록 가져오기
      const insertedUsers = await queryInterface.sequelize.query(
        `SELECT user_id FROM users;`,
      );
      const userIds = insertedUsers[0].map(u => u.user_id);

      // 3. Spotify API를 통해 음악 검색 및 데이터 생성
      const searchQuery = 'pop'; // 음악 검색어 (예시)
      const token = await getAccessToken();
      const limit = 5; // 한번에 가져올 음악의 개수
      const response = await axios.get('https://api.spotify.com/v1/search', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: searchQuery,
          type: 'track',
          limit,
        },
      });

      const tracks = response.data.tracks.items.map(track => ({
        music_title: track.name,
        artist: track.artists.map(a => a.name).join(', '),
        album: track.album.name,
        thumbnail: track.album.images[0]?.url,
        spotify_id: track.id,
        created_at: new Date(),
      }));

      // 4. 음악 데이터를 'musics' 테이블에 삽입
      await queryInterface.bulkInsert('musics', tracks, {});
      console.log('✅ Musics inserted successfully.');

      // 5. 생성된 음악 ID 가져오기
      const insertedMusics = await queryInterface.sequelize.query(
        `SELECT music_id FROM musics;`,
      );
      const musicIds = insertedMusics[0].map(m => m.music_id);

      // 6. 게시글(MoodPost) 50개 생성
      const moodPosts = [];
      for (let i = 0; i < 50; i++) {
        const randomUserId =
          userIds[Math.floor(Math.random() * userIds.length)];
        moodPosts.push({
          user_id: randomUserId,
          music_id: musicIds[i % musicIds.length], // 각각의 음악에 하나의 게시글을 연결
          title: faker.lorem.words(3),
          //   artist: tracks[i % tracks.length].artist,
          content: faker.lorem.paragraph(),
          //   post_image: faker.image.imageUrl(),
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
      await queryInterface.bulkInsert('posts', moodPosts, {});
      console.log('✅ MoodPosts inserted successfully.');

      // 7. MoodPost ID 가져오기
      const insertedPosts = await queryInterface.sequelize.query(
        `SELECT post_id FROM posts;`,
      );
      const postIds = insertedPosts[0].map(p => p.post_id);

      // 8. 랜덤 좋아요 생성 및 각 게시글별 like count 기록
      const likes = [];
      const likesCountMap = new Map();

      for (const postId of postIds) {
        const numberOfLikes = faker.number.int({ min: 0, max: 20 });
        const shuffledUsers = faker.helpers.shuffle(userIds);
        const selectedUsers = shuffledUsers.slice(0, numberOfLikes);

        likesCountMap.set(postId, numberOfLikes); // 좋아요 수 저장

        for (const userId of selectedUsers) {
          likes.push({
            user_id: userId,
            post_id: postId,
            status: 'active',
            created_at: new Date(),
            updated_at: new Date(),
          });
        }
      }

      if (likes.length > 0) {
        await queryInterface.bulkInsert('postlikes', likes, {});
        console.log('✅ Likes inserted successfully.');
      }

      // 8-1. 각 게시글의 like_count 업데이트
      for (const [postId, likeCount] of likesCountMap.entries()) {
        await queryInterface.bulkUpdate(
          'posts',
          { likes_count: likeCount },
          { post_id: postId },
        );
      }
      console.log('✅ Post likes_count updated successfully.');

      // 9. 랜덤 북마크 생성
      const bookmarks = [];
      for (const postId of postIds) {
        const numberOfBookmarks = faker.number.int({ min: 0, max: 10 });
        const shuffledUsers = faker.helpers.shuffle(userIds);
        const selectedUsers = shuffledUsers.slice(0, numberOfBookmarks);
        for (const userId of selectedUsers) {
          bookmarks.push({
            user_id: userId,
            post_id: postId,
            status: 'active',
            created_at: new Date(),
            updated_at: new Date(),
          });
        }
      }
      if (bookmarks.length > 0) {
        await queryInterface.bulkInsert('bookmarks', bookmarks, {});
        console.log('✅ Bookmarks inserted successfully.');
      }

      console.log('✅ Seed data created successfully.');
    } catch (error) {
      console.error('Error occurred during seed:', error);
      // 상세한 오류 메시지 확인
      if (error.errors) {
        console.error('Validation errors:', error.errors);
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkDelete('bookmarks', null, {});
      await queryInterface.bulkDelete('postlikes', null, {});
      await queryInterface.bulkDelete('posts', null, {});
      await queryInterface.bulkDelete('musics', null, {});
      await queryInterface.bulkDelete('users', null, {});
      console.log('✅ All records deleted successfully.');
    } catch (error) {
      console.error('Error occurred while deleting seed data:', error);
    }
  },
};
