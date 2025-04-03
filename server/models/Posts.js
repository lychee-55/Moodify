module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    'Post',
    {
      post_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      artist: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      song: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      spotify_track_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      post_image: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: 'default_image.jpg', // 기본 이미지 설정
      },
      content: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      tags: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: true,
      },
      longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true,
      },
      likes_count: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0, // 기본값 0 설정
      },
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'users', // FK 설정 (users 테이블의 user_id를 참조)
          key: 'user_id',
        },
        onDelete: 'CASCADE', // 유저 삭제 시 포스트도 삭제
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW, // 현재 시간 자동 설정
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'posts',
      timestamps: false, // created_at을 수동으로 관리하므로 true가 필요 없음
      paranoid: true,
      createdAt: 'created_at',
      deletedAt: 'deleted_at',
      indexes: [
        { fields: ['user_id'] }, // FK 인덱스
        { fields: ['likes_count'] },
        { fields: ['created_at'] },
      ],
    },
  );

  return Post;
};
