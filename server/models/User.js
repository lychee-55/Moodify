module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      user_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password_hash: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      salt: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      nickname: {
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: true,
      },
      profile_image: {
        type: DataTypes.STRING(255),
        allowNull: true,
        // defaultValue: 'default_profile.jpg'
      },
      auth_provider: {
        type: DataTypes.ENUM('email', 'kakao'),
        allowNull: false,
        // defaultValue: 'email',
      },
      kakao_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
      access_token: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      refresh_token: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'users',
      timestamps: true, // created_at 등을 직접 다룬다면 true일 필요가 없을 수 있습니다.
      paranoid: true, //deleted_at에 삭제된 시간이 기록됨
      createdAt: 'created_at',
      deletedAt: 'deleted_at',
      updatedAt: 'updated_at',
      indexes: [
        {
          unique: true,
          fields: ['email'],
        },
        {
          unique: true,
          fields: ['kakao_id'],
        },
        {
          unique: true,
          fields: ['nickname'],
        },
      ],
    },
  );
  return User;
};
