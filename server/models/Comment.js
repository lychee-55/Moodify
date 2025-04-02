const CommentModel = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    'Comment',
    {
      comment_id: {
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
      content: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      tableName: 'comments',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      paranoid: true,
      deletedAt: 'deleted_at',
      indexes: [{ fields: ['user_id'] }, { fields: ['post_id'] }],
    },
  );

  return Comment;
};

module.exports = CommentModel;
