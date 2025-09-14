# 🎵 Moodify

> **나의 일상을 음악과 함께 기록하자!**

Moodify는 음악과 감정을 연결해주는 감성 기반 음악 공유 플랫폼입니다.  
지금 당신이 느끼고 있는 그 순간의 기분을 좋아하는 음악과 함께 남기고, 다른 사람들과 나의 오늘의 무드를 공유해보세요!

&nbsp;

## 📑 목차
- [📖 프로젝트 개요](#-프로젝트-개요)
- [🛠️ Tech Stack](#️-tech-stack)
- [✨ 주요 기능](#-주요-기능)
- [🖼️ 미리보기](#-미리보기)
- [🎯 프로젝트 목적](#-프로젝트-목적)
- [📂 프로젝트 구조](#-프로젝트-구조)
- [📝 설치 및 실행](#-설치-및-실행)
- [🪞 프로젝트 회고](#-프로젝트-회고)
- [📌 향후 계획](#-향후-계획)
- [👩‍💻 About Me](#-about-me)

&nbsp;

## 📖 프로젝트 개요

- **프로젝트명 :** Moodify
- **개발 기간 :** 2025.03.31 ~ 2025.04.21 (약 3주)
- **개인 프로젝트 :** 기획부터 디자인, 프론트엔드·백엔드 개발까지 단독 수행
- **목적 :** 나의 무드를 <mark style="background-color: #FFD580;">음악과 함께 기록하고 공유하는 **소셜 다이어리 플랫폼 제작**</mark>

&nbsp;

## 🛠️ Tech Stack

![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=000000)  
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=ffffff)  
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=ffffff)  
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=ffffff)  
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=ffffff)  
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=flat&logo=sequelize&logoColor=ffffff)  
![Spotify](https://img.shields.io/badge/Spotify-1DB954?style=flat&logo=spotify&logoColor=ffffff)  
![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=flat&logo=youtube&logoColor=ffffff)

&nbsp;

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

  - Spotify 음악 검색 → YouTube 플레이어로 전체 곡 재생

  &nbsp;

## 🖼️ 미리보기

> [시연 영상 보기 (Google Drive)]([https://drive.google.com/file/d/파일ID/view?usp=sharing](https://drive.google.com/file/d/1S6ytcqjfFYGou-gQsD4GA0-qWjtdvehr/view?usp=sharing)

&nbsp;

## 🎯 프로젝트 목적

Moodify는 단순한 음악 공유를 넘어,  
**음악이 곧 감정의 언어가 되는 경험**을 제공합니다.

_“이 순간, 나는 어떤 음악의 분위기로 사람들에게 기억되고 싶을까?”_  
_“이 순간, 나의 느낌을 어떻게 생생하게 공유할 수 있을까?”_

Moodify와 함께 답을 찾아보세요.

&nbsp;

## 📂 프로젝트 구조

```
Moodify/
├── frontend/ # React + TypeScript
├── backend/ # Node.js + Express
├── database/ # Sequelize models
└── README.md
```

&nbsp;

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
```

&nbsp;

## 🪞 프로젝트 회고

- **도전 :** 처음으로 Spotify API와 YouTube API를 동시에 연동하면서, API를 활용할때 발생하는 여러 에러를 접하고 디버깅을 통해 API활용 능력과 카카오 OAuth 인증 등의 다양한 API들의 데이터 흐름을 이해할 수 있었습니다.
- **배운 점 :** 프론트엔드와 백엔드 구조를 직접 설계하면서 풀스택 개발 전반의 흐름을 경험했습니다.
- **아쉬운 점 :** 추천 시스템과 감정 분석 기능은 구현하지 못했지만, 추후 확장 계획으로 남겨두었습니다.

&nbsp;

## 📌 향후 계획

- 감정 분석 기반 음악 추천 기능

- 개인 플레이리스트 생성 및 공유

- 다국어 지원

&nbsp;

## 👩‍💻 About Me

저는 디자인 전공을 바탕으로, 사용자 경험을 중요하게 생각하는 프론트엔드 개발자입니다.  
Moodify 프로젝트는 **제가 처음으로 기획부터 풀스택 개발까지 혼자 구현한 서비스**로,  
“음악과 감정을 연결하는 경험”을 사용자에게 전달하고자 만들었습니다.

- 🌱 **관심 분야 :** 웹 프론트엔드, UI/UX, 협업 툴 개발
- 💡 **강점 :** 문제를 다양한 관점에서 바라보고 해결책을 제시하는 능력
- 🎨 **백그라운드 :** 디자인 기반 → 개발 과정에서 직관적인 인터페이스 구현에 강점
