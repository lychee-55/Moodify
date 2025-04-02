const BookMarkModel = (sequelize, DataTypes) => {
  const Bookmark = sequelize.define(
    'Bookmark',
    {
      mark_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        // FK 추가
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id',
        },
        onDelete: 'CASCADE',
      },
      post_id: {
        // FK 추가
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'posts',
          key: 'post_id',
        },
        onDelete: 'CASCADE',
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active',
        comment: '북마크 활성화 상태',
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
      tableName: 'bookmarks',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        {
          unique: true, // 중복 방지를 위한 유니크 인덱스
          fields: ['user_id', 'post_id'],
          where: { status: 'active' }, // active 상태일 때만 유니크 적용
        },
        { fields: ['user_id'] },
        { fields: ['post_id'] },
      ],
    },
  );

  return Bookmark;
};
module.exports = BookMarkModel;
