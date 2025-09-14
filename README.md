# 🎵 Moodify

> **당신의 감정을 음악으로 기록하다**  
Moodify는 음악과 감정을 연결해주는 감성 기반 음악 공유 플랫폼입니다.  
좋아하는 음악과 순간의 기분을 함께 남기고, 다른 사람들과 공감해보세요.  

---

## 🛠️ Tech Stack

![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=000000)  
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=ffffff)  
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=ffffff)  
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=ffffff)  
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=ffffff)  
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=flat&logo=sequelize&logoColor=ffffff)  
![Spotify](https://img.shields.io/badge/Spotify-1DB954?style=flat&logo=spotify&logoColor=ffffff)  
![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=flat&logo=youtube&logoColor=ffffff)  

---

## ✨ 주요 기능

- **회원가입 & 로그인**
  - 이메일 / 닉네임 가입
  - 카카오 소셜 로그인
  - 프로필 이미지 자동 생성 (AVVVATARS)

- **게시글**
  - 음악 제목, 가수, 사진, 본문, 태그, 위치 기록
  - 작성자, 작성일 자동 표시

- **소셜 기능**
  - 좋아요 / 북마크 (`status` 기반 soft delete 방식)
  - 이번 주/달 좋아요 Top 5 게시글

- **검색 & 정렬**
  - 태그별 검색 및 정렬
  - 무한 스크롤 (기본 5개 이후 자동 로드)

- **음악 연동**
  - Spotify 음악 검색 → 미리듣기 (30초)
  - YouTube 플레이어로 전체 곡 재생

---

## 🖼️ 미리보기

> (스크린샷 또는 시연 GIF를 추가하면 포트폴리오 효과가 극대화됩니다)

---

## 🎯 프로젝트 목적

Moodify는 단순한 음악 공유를 넘어,  
**음악이 곧 감정의 언어가 되는 경험**을 제공합니다.  

“이 순간, 나는 어떤 음악으로 기억되고 싶을까?”  
Moodify와 함께 답을 찾아보세요.

---

## 📂 프로젝트 구조
```
Moodify/
├── frontend/ # React + TypeScript
├── backend/ # Node.js + Express
├── database/ # Sequelize models
└── README.md
```

---

## 📝 설치 및 실행

```bash
# 클라이언트 실행
cd frontend
npm install
npm run dev

# 서버 실행
cd backend
npm install
npm start

---

## 📌 향후 계획

- 감정 분석 기반 음악 추천 기능

- 개인 플레이리스트 생성 및 공유

- 다국어 지원
