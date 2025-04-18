-- moodify 데이터베이스의 모든 테이블 삭제 (외래키 고려한 순서)
USE moodify;

-- 외래키 검사 비활성화
SET FOREIGN_KEY_CHECKS = 0;

-- 자식 테이블부터 삭제
DROP TABLE IF EXISTS likes;
DROP TABLE IF EXISTS marks;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS users;

-- 외래키 검사 재활성화
SET FOREIGN_KEY_CHECKS = 1;

SELECT * FROM SequelizeMeta;
