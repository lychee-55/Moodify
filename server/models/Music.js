module.exports = (sequelize, DataTypes) => {
  const Music = sequelize.define(
    'Music',
    {
      music_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      // 공통 정보
      music_title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      artist: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      album: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      duration_ms: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      thumbnail: {
        type: DataTypes.STRING(512),
        allowNull: true,
      },

      // Spotify 관련 정보
      spotify_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
      spotify_preview_url: {
        type: DataTypes.STRING(512),
        allowNull: true,
      },
      spotify_external_url: {
        type: DataTypes.STRING(512),
        allowNull: true,
      },

      // YouTube 관련 정보
      youtube_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
      youtube_url: {
        type: DataTypes.STRING(512),
        allowNull: true,
      },

      // 시스템 정보
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'musics',
      timestamps: false,
      indexes: [
        { fields: ['spotify_id'] },
        { fields: ['youtube_id'] },
        { fields: ['music_title'] },
        { fields: ['artist'] },
      ],
    },
  );

  //   Music.associate = function (models) {
  //     Music.hasOne(models.Post, {
  //       foreignKey: 'music_id',
  //       as: 'post',
  //     });
  //   };

  return Music;
};
